import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "./globals.css"
import StoreProvider from "./StoreProvider";
import LayoutClient from "./LayoutClient";

export const metadata = {
  title: "ShopMart",
  description: "ShopMart - Your One Stop Online Shopping Store",

  icons: {
    icon: "/logo2.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.0/css/all.min.css" integrity="sha512-ApSLB1Pd3/bZN8fWB/RG9YhN/7bd9Hkf3AGaE2mPfebjrxagjuBtx2GcgdqIlJkUzwylBo61r9Xa9NmgBI0swA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body>
        <StoreProvider>
           <LayoutClient>
          {children}
          </LayoutClient>
        </StoreProvider>
      </body>
    </html>
  );
}
