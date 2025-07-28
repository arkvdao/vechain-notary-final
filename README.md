# 🔗 VeChain Document Notarization

A web application that uploads document hashes to the VeChain blockchain using prepaid gas wallet.

## ✨ Features

- 📄 **Real VeChain blockchain integration** with prepaid gas
- 🔒 **SHA-256 file hashing** using Web Crypto API
- ⛓️ **Automatic transaction submission** to VeChain testnet
- 🎨 **Modern gradient UI** with blockchain status
- 📱 **Responsive design** for mobile and desktop
- 🔍 **VeChain explorer integration** for transaction verification

## 🚀 Deployment Options

### **Option 1: Vercel (Recommended for full functionality)**

1. **Fork this repository**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your forked repository
   - Deploy with default settings

3. **Add Environment Variables** in Vercel dashboard:
   ```
   VECHAIN_NODE_URL=https://testnet.veblocks.net
   VECHAIN_PRIVATE_KEY=your_prepaid_wallet_private_key
   ```

4. **Your app will have REAL VeChain integration!**

### **Option 2: GitHub Pages (Limited - hash generation only)**

- Deploys to: `https://your-username.github.io/repository-name/`
- **Limitation**: Cannot run VeChain API (server-side functions not supported)
- **Functionality**: Generates hashes but cannot submit to blockchain
- **Use case**: Hash generation for manual VeChain submission

## 🛠️ How it Works

### **With Vercel (Full VeChain Integration):**
1. **Select a file** (PDF, DOC, images, etc.)
2. **Click "Upload & Notarize"** 
3. **App generates SHA-256 hash**
4. **Submits hash to VeChain blockchain** using prepaid wallet
5. **Returns real transaction ID** 
6. **View on VeChain Explorer** to verify

### **With GitHub Pages (Hash Only):**
1. **Select a file**
2. **Generates SHA-256 hash** 
3. **Copy hash** for manual blockchain submission

## 🔧 Environment Variables

### **Required for Vercel deployment:**

```bash
VECHAIN_NODE_URL=https://testnet.veblocks.net
VECHAIN_PRIVATE_KEY=0x1234567890abcdef...  # Your prepaid wallet private key
```

### **Prepaid Wallet Setup:**
- Use VeChain testnet for development
- Fund wallet with VTHO for gas fees
- Keep private key secure in Vercel environment variables

## 🔐 Security

- ✅ **Private key stored** in Vercel environment variables
- ✅ **Files processed client-side** - never uploaded to servers
- ✅ **Hash generation** uses standard Web Crypto API
- ✅ **VeChain integration** uses official Connex framework
- ✅ **Open source** and auditable

## 🎯 Real Blockchain Features (Vercel only)

- **Real VeChain transactions** with your prepaid wallet
- **Testnet notarization** for development/testing
- **Transaction receipts** with block numbers
- **Gas usage tracking** 
- **VeChain Explorer links** for verification
- **Automatic confirmation** waiting

## 📱 Test Your Hash

Upload the same file twice - you'll get the **identical hash**, proving the SHA-256 calculation is legitimate and deterministic.

## 🌐 Live Demos

- **GitHub Pages** (hash only): `https://your-username.github.io/patent-claude/`
- **Vercel** (full VeChain): Deploy to get your custom URL with real blockchain!

---

**🚀 Deploy to Vercel for real VeChain blockchain integration with your prepaid wallet!**