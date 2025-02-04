const paypal=require('paypal-rest-sdk')


paypal.configure({
    mode:'sandbox',
    client_id:'ATyH6IBxbAvkhmOMHzX3PZH5klG_9qrSFIcIKsxip_rejtWpaEtCDe-BHF_KUooo0IzeMYS5GNIQHqlO',
    client_secret:'EOP5mYokq0OlQaqxQh_gPWaPKh6lOLKU3dmEqbkozUtdDZi4KkTjQP2Em6nKzj9bfbsRfH3VIApTh3Hs'
})
module.exports=paypal