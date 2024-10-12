from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import joblib
import numpy as np

app = FastAPI()

Model = joblib.load('./random_forest_model.pkl')

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
