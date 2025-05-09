import pandas as pd
import numpy as np

def generate_systematic_sales_data(n_stores=10, n_depts=5, start_date='2018-01-01', end_date='2023-12-31'):
    # Generate a weekly date range
    dates = pd.date_range(start=start_date, end=end_date, freq='W-MON')  # Weekly data on Mondays
    n_weeks = len(dates)

    # Generate all combinations of Store, Dept, and Week
    stores = range(1, n_stores + 1)
    depts = range(1, n_depts + 1)
    combinations = [(store, dept, date) for store in stores for dept in depts for date in dates]

    df = pd.DataFrame(combinations, columns=["Store", "Dept", "Date"])

    # Set store types and sizes systematically
    store_info = pd.DataFrame({
        "Store": stores,
        "Type": np.random.choice(['A', 'B', 'C'], size=n_stores),
        "Size": np.linspace(30000, 200000, n_stores).astype(int)
    })

    df = df.merge(store_info, on="Store", how="left")

    # Holiday and seasonal patterns
    df["IsHoliday"] = df["Date"].dt.month.isin([11, 12]) & (df["Date"].dt.week <= 52)
    df["Month"] = df["Date"].dt.month
    df["WeekOfYear"] = df["Date"].dt.isocalendar().week

    # Base sales trends per department
    dept_base = {dept: 5000 + dept * 50 for dept in depts}  # Higher dept ID → higher base sales
    df["BaseSales"] = df["Dept"].map(dept_base)

    # Add seasonality
    seasonal_factors = {
        1: 0.9, 2: 0.85, 3: 0.95, 4: 1.0, 5: 1.05, 6: 1.1,
        7: 1.15, 8: 1.1, 9: 1.0, 10: 1.05, 11: 1.3, 12: 1.5
    }
    df["Seasonality"] = df["Month"].map(seasonal_factors)

    # Holiday multiplier
    df["HolidayBoost"] = np.where(df["IsHoliday"], 1.2, 1.0)

    # Store type multiplier
    type_multiplier = {"A": 1.2, "B": 1.0, "C": 0.9}
    df["TypeEffect"] = df["Type"].map(type_multiplier)

    # Size effect (normalized)
    df["SizeEffect"] = df["Size"] / df["Size"].max()

    # Add some consistent noise per store-dept (reproducible pattern)
    np.random.seed(42)
    store_dept_noise = {(s, d): np.random.normal(1.0, 0.05) for s in stores for d in depts}
    df["Noise"] = df.apply(lambda row: store_dept_noise[(row["Store"], row["Dept"])], axis=1)

    # Final sales
    df["Weekly_Sales"] = (
        df["BaseSales"] *
        df["Seasonality"] *
        df["HolidayBoost"] *
        df["TypeEffect"] *
        df["Noise"]
    ) + (df["SizeEffect"] * 5000)

    df["Weekly_Sales"] = df["Weekly_Sales"].clip(1000, 70000).round(2)

    # Drop helpers
    df.drop(columns=["Month", "WeekOfYear", "BaseSales", "Seasonality", "HolidayBoost", "TypeEffect", "SizeEffect", "Noise"], inplace=True)

    return df

# Example usage:
synthetic_df = generate_systematic_sales_data(n_stores=10, n_depts=5)
synthetic_df.to_csv("systematic_sales_data.csv", index=False)
print(f"Generated {len(synthetic_df)} rows of systematic synthetic data.")
