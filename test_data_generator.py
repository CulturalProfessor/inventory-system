import pandas as pd
import numpy as np

def generate_realistic_sales_data(n_rows):
    # Date range
    start_date = pd.to_datetime('2010-01-01')
    end_date = pd.to_datetime('2023-12-31')
    all_dates = pd.date_range(start=start_date, end=end_date, freq='D')

    # Sample random dates
    dates = np.random.choice(all_dates, size=n_rows)

    # Generate base data
    df = pd.DataFrame({
        'Store': np.random.randint(1, 46, size=n_rows),
        'Dept': np.random.randint(1, 100, size=n_rows),
        'IsHoliday': np.random.choice([True, False], size=n_rows),
        'Size': np.random.randint(10000, 200000, size=n_rows),
        'Type': np.random.choice(['A', 'B', 'C'], size=n_rows),
        'Date': dates
    })

    # Extract month for seasonality
    df['Month'] = pd.to_datetime(df['Date']).dt.month

    # Base weekly sales
    base_sales = np.random.uniform(5000, 30000, size=n_rows)

    # Seasonal multiplier
    seasonality_multiplier = df['Month'].map({
        11: 1.3,  # November: Black Friday boost
        12: 1.5,  # December: Holiday season
        7: 1.1,   # July: Summer sales
    }).fillna(1.0)

    # Holiday multiplier
    holiday_multiplier = np.where(df['IsHoliday'], 1.2, 1.0)

    # Store size effect (normalized)
    size_effect = df['Size'] / df['Size'].max()

    # Type-based multiplier (assumes A > B > C)
    type_multiplier = df['Type'].map({'A': 1.2, 'B': 1.0, 'C': 0.9})

    # Additive noise
    noise = np.random.normal(0, 3000, size=n_rows)

    # Final sales calculation
    df['Weekly_Sales'] = (base_sales * seasonality_multiplier *
                          holiday_multiplier * type_multiplier) + \
                          (size_effect * 5000) + noise

    # Clip sales to avoid unrealistic extremes
    df['Weekly_Sales'] = df['Weekly_Sales'].clip(lower=1000, upper=70000)

    # Drop helper column
    df.drop(columns=['Month'], inplace=True)

    return df

synthetic_df = generate_realistic_sales_data(10000)
synthetic_df.to_csv('synthetic_walmart_sales_data.csv', index=False)

print(f"Generated {len(synthetic_df)} rows of realistic synthetic data.")
