import { useMemo, useState } from "react";
import { Button } from "../vendor/telegram-ui-kit/src/components/Button/Button";
import { Icon } from "../vendor/telegram-ui-kit/src/components/Icon/Icon";
import { Image } from "../vendor/telegram-ui-kit/src/components/Image/Image";
import { Input } from "../vendor/telegram-ui-kit/src/components/Input/Input";
import { Sheet } from "../vendor/telegram-ui-kit/src/components/Sheet/Sheet";
import { Text } from "../vendor/telegram-ui-kit/src/components/Text/Text";

import styles from "./app.module.scss";

type Currency = "GRAM" | "USDT";
type Amount = "5" | "10" | "25" | "custom";

const currencies: Array<{ id: Currency; title: string; subtitle: string; icon: string }> = [
  { id: "GRAM", title: "Gram", subtitle: "GRAM", icon: "/assets/gram.svg" },
  { id: "USDT", title: "USDT on TON", subtitle: "USDT", icon: "/assets/usdt.svg" },
];

const amounts: Amount[] = ["5", "10", "25", "custom"];

interface TipSheetProps {
  currency: Currency;
  amount: Amount;
  customAmount: string;
  onCurrencyChange: (currency: Currency) => void;
  onAmountChange: (amount: Amount) => void;
  onCustomAmountChange: (amount: string) => void;
  onSubmit: () => void;
}

function TipSheet({
  currency,
  amount,
  customAmount,
  onCurrencyChange,
  onAmountChange,
  onCustomAmountChange,
  onSubmit,
}: TipSheetProps) {
  const displayAmount = amount === "custom" ? customAmount || "0" : amount;
  const buttonLabel = `Send ${displayAmount} ${currency === "GRAM" ? "GRAM" : "USDT"}`;

  return (
    <div className={styles.sheetContent}>
      <div className={styles.grabber} aria-hidden="true" />
      <div className={styles.sheetHeader}>
        <Text as="h2" type="title2" weight="bold">Tip me</Text>
      </div>

      <section className={styles.section}>
        <Text as="h3" type="caption2" weight="semibold" uppercase color="secondary" className={styles.sectionLabel}>
          CHOOSE A CURRENCY
        </Text>
        <div className={styles.card}>
          {currencies.map((item, index) => (
            <button
              key={item.id}
              className={`${styles.currencyRow} ${currency === item.id ? styles.selectedRow : ""}`}
              onClick={() => onCurrencyChange(item.id)}
              aria-pressed={currency === item.id}
            >
              <span className={styles.currencyIcon}>
                <img src={item.icon} alt="" />
              </span>
              <span className={styles.currencyCopy}>
                <span className={styles.currencyTitle}>{item.title}</span>
                <span className={styles.currencySubtitle}>{item.subtitle}</span>
              </span>
              <span className={styles.checkArea} aria-hidden="true">
                {currency === item.id && <Icon name="check" width="18px" height="18px" color="primary" />}
              </span>
              {index === 0 && <span className={styles.rowDivider} />}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <Text as="h3" type="caption2" weight="semibold" uppercase color="secondary" className={styles.sectionLabel}>
          CHOOSE AN AMOUNT
        </Text>
        <div className={styles.amountGrid}>
          {amounts.map((item) => (
            <button
              key={item}
              className={`${styles.amountPill} ${amount === item ? styles.amountActive : ""}`}
              onClick={() => onAmountChange(item)}
              aria-pressed={amount === item}
            >
              {item === "custom" ? "Custom" : item}
            </button>
          ))}
        </div>
        {amount === "custom" && (
          <label className={styles.customInput}>
            <span className={styles.customInputPrefix}>{currency === "GRAM" ? "GRAM" : "USDT"}</span>
            <Input
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="Enter amount"
              value={customAmount}
              onChange={onCustomAmountChange}
              aria-label="Custom tip amount"
              className={styles.amountInput}
            />
          </label>
        )}
      </section>

      <div className={styles.ctaArea}>
        <Button
          type="primary"
          onClick={onSubmit}
          disabled={Number(displayAmount) <= 0 || !displayAmount}
          className={styles.sendButton}
        >
          {buttonLabel}
        </Button>
        <Text type="footnote" align="center" color="tertiary" className={styles.walletHint}>
          Your TON wallet will open for confirmation.
        </Text>
      </div>
    </div>
  );
}

export function App() {
  const [currency, setCurrency] = useState<Currency>("GRAM");
  const [amount, setAmount] = useState<Amount>("5");
  const [customAmount, setCustomAmount] = useState("");
  const [sheetOpen, setSheetOpen] = useState(true);

  const sheets = useMemo(
    () => ({
      tip: () => (
        <TipSheet
          currency={currency}
          amount={amount}
          customAmount={customAmount}
          onCurrencyChange={setCurrency}
          onAmountChange={(value) => {
            setAmount(value);
            if (value !== "custom") setCustomAmount("");
          }}
          onCustomAmountChange={setCustomAmount}
          onSubmit={() => {
            const value = amount === "custom" ? customAmount : amount;
            window.dispatchEvent(new CustomEvent("tip:submit", { detail: { currency, amount: value } }));
          }}
        />
      ),
    }),
    [currency, amount, customAmount],
  );

  return (
    <main className={styles.page}>
      <div className={styles.profileBackdrop} aria-hidden="true" />
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.backdropVignette} aria-hidden="true" />

      <section className={styles.profile} aria-label="JAMMM profile">
        <div className={styles.avatarWrap}>
          <Image
            src="/assets/avatar.svg"
            alt="JAMMM avatar"
            width="clamp(7rem, 35vw, 9.25rem)"
            height="clamp(7rem, 35vw, 9.25rem)"
            borderRadius="50%"
            objectFit="cover"
            className={styles.avatar}
          />
          <span className={styles.onlineDot} aria-label="online" />
        </div>

        <Text as="h1" type="hero" weight="bold" align="center" className={styles.name}>
          JAMMM
        </Text>
        <Text type="subheadline2" align="center" color="secondary" className={styles.handle}>
          @jammm
        </Text>

        <div className={styles.profileActions}>
          <a className={styles.profileAction} href="#channel">
            <span className={styles.actionMark}>t.me</span>
            <span>Channel</span>
          </a>
          <a className={styles.profileAction} href="#chat">
            <span className={styles.actionMark}>⌘</span>
            <span>Chat</span>
          </a>
        </div>

        <Button type="secondary" onClick={() => setSheetOpen(true)} className={styles.tipTrigger}>
          Tip me
        </Button>
      </section>

      <Sheet sheets={sheets} activeSheet="tip" opened={sheetOpen} onClose={() => setSheetOpen(false)} />
    </main>
  );
}
