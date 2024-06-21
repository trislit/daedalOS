// components/system/ThirdWeb/SplashScreen.tsx
import type React from "react";
import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "components/system/ThirdWeb/thirdWebClient";
import styles from "components/system/ThirdWeb/SplashScreen.module.css";

interface SplashScreenProps {
  onConnect: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onConnect }) => (
  <div className={styles.splashScreen}>
    <ConnectButton
      client={client}
      connectModal={{ size: "wide" }}
      onConnect={onConnect}
      theme="dark"
      wallets={wallets}
    />
  </div>
);

export default SplashScreen;