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
        train_df = pd.DataFrame([{
            "Store": product.Store,
            "Dept": product.Dept,
            "IsHoliday": int(product.IsHoliday),
            "Size": product.Size,
            "Type": product.Type,
            "Weekly_Sales": product.Weekly_Sales,
            "Date": product.Date
        } for product in body.data])

        if 'Date' not in train_df.columns:
            raise HTTPException(
                status_code=400, detail="'Date' column is missing in the data.")

        try:
            train_df['Date'] = pd.to_datetime(train_df['Date'], errors='raise')
        except Exception:
            raise HTTPException(
                status_code=400, detail="Invalid date format in 'Date' column.")

        # Encode categorical features
        label_encoder = LabelEncoder()
        train_df['Type'] = label_encoder.fit_transform(train_df['Type'])

        # Extract features
        train_df['Week'] = train_df['Date'].dt.isocalendar().week
        train_df['Year'] = train_df['Date'].dt.year

        X = train_df[['Store', 'Dept', 'IsHoliday', 'Size', 'Week', 'Type', 'Year']]
        y = train_df['Weekly_Sales']

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        RF = RandomForestRegressor(
            n_estimators=58,
            max_depth=27,
            max_features=6,
            min_samples_split=3,
            min_samples_leaf=1,
            random_state=42
        )
        RF.fit(X_train, y_train)

        # Evaluate model
        y_pred = RF.predict(X_test)
        metrics = {
            "RMSE": round(np.sqrt(mean_squared_error(y_test, y_pred)), 2),
            "MAE": round(mean_absolute_error(y_test, y_pred), 2),
            "R2_Score": round(r2_score(y_test, y_pred), 4)
        }

        joblib.dump(RF, MODEL_PATH)
        global Model
        Model = RF

        return {
            "success": True,
            "message": "Model retrained successfully with the new data.",
            "metrics": metrics
        }

    except Exception as e:
        print(f"Error processing the data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))