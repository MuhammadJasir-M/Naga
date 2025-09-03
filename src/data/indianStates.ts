export interface IndianState {
  code: string;
  name: string;
  capital: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast';
}

export const indianStates: IndianState[] = [
  // States
  { code: 'AP', name: 'Andhra Pradesh', capital: 'Amaravati', region: 'South' },
  { code: 'AR', name: 'Arunachal Pradesh', capital: 'Itanagar', region: 'Northeast' },
  { code: 'AS', name: 'Assam', capital: 'Dispur', region: 'Northeast' },
  { code: 'BR', name: 'Bihar', capital: 'Patna', region: 'East' },
  { code: 'CT', name: 'Chhattisgarh', capital: 'Raipur', region: 'Central' },
  { code: 'GA', name: 'Goa', capital: 'Panaji', region: 'West' },
  { code: 'GJ', name: 'Gujarat', capital: 'Gandhinagar', region: 'West' },
  { code: 'HR', name: 'Haryana', capital: 'Chandigarh', region: 'North' },
  { code: 'HP', name: 'Himachal Pradesh', capital: 'Shimla', region: 'North' },
  { code: 'JH', name: 'Jharkhand', capital: 'Ranchi', region: 'East' },
  { code: 'KA', name: 'Karnataka', capital: 'Bengaluru', region: 'South' },
  { code: 'KL', name: 'Kerala', capital: 'Thiruvananthapuram', region: 'South' },
  { code: 'MP', name: 'Madhya Pradesh', capital: 'Bhopal', region: 'Central' },
  { code: 'MH', name: 'Maharashtra', capital: 'Mumbai', region: 'West' },
  { code: 'MN', name: 'Manipur', capital: 'Imphal', region: 'Northeast' },
  { code: 'ML', name: 'Meghalaya', capital: 'Shillong', region: 'Northeast' },
  { code: 'MZ', name: 'Mizoram', capital: 'Aizawl', region: 'Northeast' },
  { code: 'NL', name: 'Nagaland', capital: 'Kohima', region: 'Northeast' },
  { code: 'OR', name: 'Odisha', capital: 'Bhubaneswar', region: 'East' },
  { code: 'PB', name: 'Punjab', capital: 'Chandigarh', region: 'North' },
  { code: 'RJ', name: 'Rajasthan', capital: 'Jaipur', region: 'North' },
  { code: 'SK', name: 'Sikkim', capital: 'Gangtok', region: 'Northeast' },
  { code: 'TN', name: 'Tamil Nadu', capital: 'Chennai', region: 'South' },
  { code: 'TG', name: 'Telangana', capital: 'Hyderabad', region: 'South' },
  { code: 'TR', name: 'Tripura', capital: 'Agartala', region: 'Northeast' },
  { code: 'UP', name: 'Uttar Pradesh', capital: 'Lucknow', region: 'North' },
  { code: 'UT', name: 'Uttarakhand', capital: 'Dehradun', region: 'North' },
  { code: 'WB', name: 'West Bengal', capital: 'Kolkata', region: 'East' },
  
  // Union Territories
  { code: 'AN', name: 'Andaman and Nicobar Islands', capital: 'Port Blair', region: 'South' },
  { code: 'CH', name: 'Chandigarh', capital: 'Chandigarh', region: 'North' },
  { code: 'DN', name: 'Dadra and Nagar Haveli', capital: 'Silvassa', region: 'West' },
  { code: 'DD', name: 'Daman and Diu', capital: 'Daman', region: 'West' },
  { code: 'DL', name: 'Delhi', capital: 'New Delhi', region: 'North' },
  { code: 'JK', name: 'Jammu and Kashmir', capital: 'Srinagar', region: 'North' },
  { code: 'LA', name: 'Ladakh', capital: 'Leh', region: 'North' },
  { code: 'LD', name: 'Lakshadweep', capital: 'Kavaratti', region: 'South' },
  { code: 'PY', name: 'Puducherry', capital: 'Puducherry', region: 'South' }
];

export const regionColors = {
  North: 'hsl(var(--primary))',
  South: 'hsl(var(--accent))', 
  East: 'hsl(var(--success))',
  West: 'hsl(var(--warning))',
  Central: 'hsl(var(--info))',
  Northeast: 'hsl(var(--critical))'
};