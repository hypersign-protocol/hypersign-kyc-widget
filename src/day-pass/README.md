- User opens the day-pass.vue form 
- User goes through ID veriifcaiton (opens ID.vue) 
- [All user's persoanl data gets filled in the form] ------------> AadhaarCredential 
- User proceeds to paymetn page (opens payment-gateway.vue) -----> InvoiceCredential
- User's day pass is issued  -------> DayPassCredential 
- User's pass is downloaded in the form of PDF. ---> Presentation[AadhaarCredential, InvoiceCredential, DayPassCredential]

--------------------------------

- User is asked to show his day's pass presentation 
- Security can view all his 3 credentials 
- All credentials are verified
- USer is checkedIn


## IdCredential

```js
{
   '@context': 'https://schema.org/Person'
    name: '',
    dod: '',
    phoneNumber: '',
    email: '',
}
```

## InvoiceCredential


```js
{
    '@context': 'https://schema.org/Invoice',
    accountId: '123123',
    broker: 'RazorPay',
    invoiceNumber: '12314',
    customer: 'user',
    provider: 'Beehive Workspace',
    paymentMethod: 'UPI',
    paymentStatus: 'Success',
}
```
## Daypass: sch:hid:testnet:zHJTSuEmcGn5oCe7K58BrGbxULe7DnRzkBF7yVHZEveEJ:1.0
```js

    {
        fullname: '',
        companyName: '',
        issuanceDate: '',
        expirationDate: '',
        center: '',
        issuer: '',
        invoiceNumber: ''

```


## Create presentation with these three credentials ... 

Presentation[AadhaarCredential, InvoiceCredential, DayPassCredential] -> pdf QR

