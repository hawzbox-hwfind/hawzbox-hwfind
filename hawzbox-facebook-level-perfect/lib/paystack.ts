
export function payWithPaystack({email, amount, publicKey, onSuccess, onClose}:{email:string, amount:number, publicKey:string, onSuccess:()=>void, onClose:()=>void}){
  // @ts-ignore
  const handler = window.PaystackPop.setup({
    key: publicKey,
    email,
    amount: amount * 100,
    currency: 'NGN',
    callback: function(){ onSuccess() },
    onClose: function(){ onClose() }
  })
  handler.openIframe()
}
