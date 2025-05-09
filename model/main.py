from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

app = FastAPI()

MODEL_PATH = './random_forest_model.pkl'
Model = joblib.load(MODEL_PATH)


class Product(BaseModel):
    store: int
    dept: int
    isholiday: int
    size: int
    week: int
    type: int
    year: int


class PredictRequest(BaseModel):
    products: List[Product]


class UploadedProduct(BaseModel):
    Store: int
    Dept: int
    IsHoliday: bool
    Size: int
    Type: str
    Weekly_Sales: float
    Date: str


class UploadDataRequest(BaseModel):
    data: List[UploadedProduct]


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/predictSales")
def predict_sales(body: PredictRequest):
    try:
        numeric_data = [
            [
                product.store,
                product.dept,
                product.isholiday,
                product.size,
                product.week,
                product.type,
                product.year
            ]
            for product in body.products
        ]
        input_array = np.array(numeric_data)
        pred = Model.predict(input_array)
        pred_list = pred.tolist()
        return {"success": True, "predicted_sales": pred_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/uploadData")
def upload_data(body: UploadDataRequest):
    try:
        # Construct DataFrame
        train_df = pd.DataFrame([{
            "Store": p.Store,
            "Dept": p.Dept,
            "IsHoliday": int(p.IsHoliday),
            "Size": p.Size,
            "Type": p.Type,
            "Weekly_Sales": p.Weekly_Sales,
            "Date": p.Date
        } for p in body.data])

        # Validate 'Date'
        if 'Date' not in train_df.columns:
            raise HTTPException(
                status_code=400, detail="'Date' column is missing.")
        try:
            train_df['Date'] = pd.to_datetime(train_df['Date'], errors='raise')
        except Exception:
            raise HTTPException(
                status_code=400, detail="Invalid 'Date' format.")

        # Feature Engineering
        label_encoder = LabelEncoder()
        train_df['Type'] = label_encoder.fit_transform(train_df['Type'])
        train_df['Week'] = train_df['Date'].dt.isocalendar().week
        train_df['Year'] = train_df['Date'].dt.year

        X = train_df[['Store', 'Dept', 'IsHoliday',
                      'Size', 'Week', 'Type', 'Year']]
        y = train_df['Weekly_Sales']

        # Split data
        X_train, X_temp, y_train, y_temp = train_test_split(
            X, y, test_size=0.3, random_state=42)
        X_valid, X_test, y_valid, y_test = train_test_split(
            X_temp, y_temp, test_size=0.5, random_state=42)

        # Train model
        RF = RandomForestRegressor(
            n_estimators=58,
            max_depth=27,
            max_features=6,
            min_samples_split=3,
            min_samples_leaf=1,
            random_state=42
        )
        RF.fit(X_train, y_train)

        # Predictions
        y_valid_pred = RF.predict(X_valid)
        y_test_pred = RF.predict(X_test)

        # Metrics
        valid_metrics = {
            "RMSE": round(np.sqrt(mean_squared_error(y_valid, y_valid_pred)), 2),
            "MAE": round(mean_absolute_error(y_valid, y_valid_pred), 2),
            "R2_Score": round(r2_score(y_valid, y_valid_pred), 4)
        }
        test_metrics = {
            "RMSE": round(np.sqrt(mean_squared_error(y_test, y_test_pred)), 2),
            "MAE": round(mean_absolute_error(y_test, y_test_pred), 2),
            "R2_Score": round(r2_score(y_test, y_test_pred), 4)
        }

        # Optional: Add a few sample predictions for debugging
        sample_preds = pd.DataFrame({
            "Actual": y_test[:5].values,
            "Predicted": y_test_pred[:5]
        }).to_dict(orient="records")

        # Save and assign globally
        joblib.dump(RF, MODEL_PATH)
        global Model
        Model = RF

        return {
            "success": True,
            "message": "Model retrained successfully with the new data.",
            "metrics": {
                "validation": valid_metrics,
                "test": test_metrics
            },
            "sample_predictions": sample_preds
        }

    except Exception as e:
        print(f"Error processing the data: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Internal server error: " + str(e))
