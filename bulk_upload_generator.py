import pandas as pd
import numpy as np

def generate_random_data(n_rows):
    start_date = pd.to_datetime('2010-01-01')
    end_date = pd.to_datetime('2023-12-31')
    random_dates = pd.date_range(start=start_date, end=end_date, freq='D')

    dates = np.random.choice(random_dates, size=n_rows)

    data = {
        'Store': np.random.randint(1, 46, size=n_rows),
        'Dept': np.random.randint(1, 100, size=n_rows),
        'Size': np.random.randint(10000, 200000, size=n_rows),
        'Type': np.random.choice([1, 2, 3], size=n_rows),
        'Date': dates 
    }

    df = pd.DataFrame(data)

    return df

random_data = generate_random_data(20)
random_data.to_csv('bulk_upload.csv', index=False)

print(f"Generated {len(random_data)} rows of random data with dates.")
