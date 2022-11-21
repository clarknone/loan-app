# Loan App
#### Calculate daily payable amounts for users

## Formula Used
Loan Interest = P * (r/d) * (d/365)

Amount to Pay = P + LoanInterest * d

Penalty Interest = Amount to Pay * pr * d

Penalty Amount = AmountToPay + PenaltyInterst + (Principle * floor(d/15)* p15)


- where:
-   r=interest rate (0.08)
-   d= duedate - now
-   p15 = 0.02 (extra 2% penalty charges for every 15 days if not paid)

