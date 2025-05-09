import pandas as pd
import numpy as np

def generate_random_data_with_adjusted_sales(n_rows):
    start_date = pd.to_datetime('2010-01-01')
    end_date = pd.to_datetime('2023-12-31')
    random_dates = pd.date_range(start=start_date, end=end_date, freq='D')

    # Generate random dates from the random_dates range
    dates = np.random.choice(random_dates, size=n_rows)

    # Create random store and department data
    data = {
        'Store': np.random.randint(1, 46, size=n_rows),  # Store IDs between 1 and 45
        'Dept': np.random.randint(1, 100, size=n_rows),  # Department IDs between 1 and 99
        'Size': np.random.randint(1000, 10000, size=n_rows),  # Random store size between 10,000 and 200,000
        'Type': np.random.choice([1, 2, 3], size=n_rows),  # Store Type (1, 2, or 3)
        'Date': dates  # Random dates from the date range
    }

    # Convert to DataFrame
    df = pd.DataFrame(data)

    # Add seasonality (simplified model)
    seasonal_factors = {1: 0.9, 2: 0.85, 3: 0.95, 4: 1.0, 5: 1.05, 6: 1.1,
                        7: 1.15, 8: 1.1, 9: 1.0, 10: 1.05, 11: 1.3, 12: 1.5}
    df['Month'] = df['Date'].dt.month
    df['Seasonality'] = df['Month'].map(seasonal_factors)

    # Add store type effects
    type_multiplier = {1: 1.2, 2: 1.0, 3: 0.9}
    df['TypeEffect'] = df['Type'].map(type_multiplier)

    # Now we update the sales formula to give a more realistic weight to size
    df['BaseSales'] = 3000 + df['Dept'] * 30  # Adjusted base sales based on department (lower base)
    df['SizeEffect'] = df['Size'] / 200000  # Size normalized to a more moderate scale

    # Calculate weekly sales with the updated formula (more realistic relationship with Size)
    df['Weekly_Sales'] = (
        df['BaseSales'] * 
        df['Seasonality'] * 
        df['TypeEffect'] + 
        df['SizeEffect'] * 5000  # Smaller effect of Size on sales
    )

    # Adding moderate noise to the sales data (with smaller fluctuations)
    np.random.seed(42)
    noise = np.random.normal(1.0, 0.02, size=n_rows)  # Reduced noise effect
    df['Weekly_Sales'] = df['Weekly_Sales'] * noise

    # Clip the sales values to ensure realistic bounds (set a maximum cap on sales)
    df['Weekly_Sales'] = df['Weekly_Sales'].clip(1000, 35000).round(2)  # Adjust max cap to 35,000 for realism

    # Drop unnecessary columns for final dataset
    df.drop(columns=['Month', 'BaseSales', 'Seasonality', 'TypeEffect'], inplace=True)

    return df

# Generate random data with 20 rows
random_data = generate_random_data_with_adjusted_sales(20)

# Save the data to a CSV file
random_data.to_csv('bulk_upload.csv', index=False)

# Print confirmation of data generation
print(f"Generated {len(random_data)} rows of random data with realistic sales.")
