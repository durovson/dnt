import React, { useMemo, useState } from "react";
import { Button } from "../vendor/telegram-ui-kit/src/components/Button/Button";
import { Image } from "../vendor/telegram-ui-kit/src/components/Image/Image";
import { Input } from "../vendor/telegram-ui-kit/src/components/Input/Input";
import { Sheet } from "../vendor/telegram-ui-kit/src/components/Sheet/Sheet";
import { Text } from "../vendor/telegram-ui-kit/src/components/Text/Text";

import styles from "./app.module.scss";

type Currency = "GRAM" | "USDT";
type Amount = "5" | "10" | "25" | "custom";

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

const PROFILE_BG = asset("profile-bg.jpg");
const AVATAR = asset("avatar.jpg");

const RECIPIENT_ADDRESS =
  "UQDlmQfncLTHp_ceI6gz8eA19wQ2cia9ysskYO-ZA1IANpDx";
const USDT_MASTER =
  "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs";

const GRAM_ICON = asset("gram.svg");
const USDT_ICON = asset("usdt.svg");

const currencies: Array<{
  id: Currency;
  title: string;
  subtitle: string;
  icon: string;
  fallback: string;
}> = [
  {
    id: "GRAM",
    title: "Gram",
    subtitle: "GRAM",
    icon: GRAM_ICON,
    fallback: asset("gram.svg"),
  },
  {
    id: "USDT",
    title: "USDT on TON",
    subtitle: "USDT",
    icon: USDT_ICON,
    fallback: asset("usdt.svg"),
  },
];

const amounts: Amount[] = ["5", "10", "25", "custom"];

function toSmallestUnit(value: string, decimals: number): bigint | null {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null;

  const [whole, fraction = ""] = normalized.split(".");
  if (fraction.length > decimals) return null;

  const padded = fraction.padEnd(decimals, "0");
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(padded || "0");
}

function buildPaymentLinks(currency: Currency, amount: string) {
  const decimals = currency === "GRAM" ? 9 : 6;
  const units = toSmallestUnit(amount, decimals);
  if (units === null || units <= 0n) return null;

  const text = encodeURIComponent("Support • JAMMM");
  const query =
    currency === "GRAM"
      ? `amount=${units.toString()}&text=${text}`
      : `jetton=${USDT_MASTER}&amount=${units.toString()}&text=${text}`;

  return {
    ton: `ton://transfer/${RECIPIENT_ADDRESS}?${query}`,
    tonkeeper: `https://app.tonkeeper.com/transfer/${RECIPIENT_ADDRESS}?${query}`,
  };
}

function TelegramPlaneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.5 4.2 17.1 20c-.25 1.12-.9 1.4-1.82.87l-4.95-3.65-2.39 2.3c-.26.26-.48.48-.98.48l.36-5.04 9.17-8.28c.4-.36-.09-.56-.62-.2L4.54 13.62.1 12.23c-.97-.31-.99-.98.2-1.44L17.62 4c.8-.3 1.5.18 1.2.2l1.68.02Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg className={styles.checkMark} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4.2 10.5 8.4 14.6 15.9 5.9" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 10.5V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" />
    </svg>
  );
}

function TipSheet() {
  const [currency, setCurrency] = useState<Currency>("GRAM");
  const [amount, setAmount] = useState<Amount>("5");
  const [customAmount, setCustomAmount] = useState("");

  const displayAmount = amount === "custom" ? customAmount : amount;
  const links = buildPaymentLinks(currency, displayAmount);
  const tokenLabel = currency === "GRAM" ? "GRAM" : "USDT";
  const buttonLabel = `Send ${displayAmount || "0"} ${tokenLabel}`;

  const handleSubmit = () => {
    if (!links) return;

    // `ton://transfer` is the interoperable TON payment-link format.
    // On desktop we prefer the same transfer through Tonkeeper's HTTPS universal link.
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    window.location.href = isTouch ? links.ton : links.tonkeeper;
  };

  return (
    <div className={styles.sheetContent}>
      <div className={styles.grabberZone} aria-hidden="true">
        <div className={styles.grabber} />
      </div>

      <div className={styles.sheetHeader}>
        <Text as="h2" type="title2" weight="bold">
          Support
        </Text>
      </div>

      <section className={styles.section}>
        <Text
          as="h3"
          type="caption2"
          weight="semibold"
          uppercase
          color="secondary"
          className={styles.sectionLabel}
        >
          CHOOSE A CURRENCY
        </Text>

        <div className={styles.card}>
          {currencies.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={`${styles.currencyRow} ${currency === item.id ? styles.selectedRow : ""}`}
              onClick={() => setCurrency(item.id)}
              aria-pressed={currency === item.id}
            >
              <span className={styles.currencyIcon}>
                <img
                  src={item.icon}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.src = item.fallback;
                  }}
                />
              </span>
              <span className={styles.currencyCopy}>
                <span className={styles.currencyTitle}>{item.title}</span>
                <span className={styles.currencySubtitle}>{item.subtitle}</span>
              </span>
              <span className={styles.checkArea} aria-hidden="true">
                {currency === item.id && <CheckMark />}
              </span>
              {index === 0 && <span className={styles.rowDivider} />}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <Text
          as="h3"
          type="caption2"
          weight="semibold"
          uppercase
          color="secondary"
          className={styles.sectionLabel}
        >
          CHOOSE AN AMOUNT
        </Text>

        <div className={styles.amountGrid}>
          {amounts.map((item) => (
            <button
              type="button"
              key={item}
              className={`${styles.amountPill} ${amount === item ? styles.amountActive : ""}`}
              onClick={() => setAmount(item)}
              aria-pressed={amount === item}
            >
              {item === "custom" ? "Custom" : item}
            </button>
          ))}
        </div>

        {amount === "custom" && (
          <label className={styles.customInput}>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="Enter amount"
              value={customAmount}
              onChange={setCustomAmount}
              aria-label="Custom tip amount"
              autoFocus
              className={styles.amountInput}
            />
          </label>
        )}
      </section>

      <div className={styles.ctaArea}>
        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={!links}
          className={styles.sendButton}
        >
          {buttonLabel}
        </Button>
        <Text
          type="footnote"
          align="center"
          color="tertiary"
          className={styles.walletHint}
        >
          Your TON wallet will open for confirmation.
        </Text>
      </div>
    </div>
  );
}

export function App() {
  const [sheetOpen, setSheetOpen] = useState(false);

  const sheets = useMemo(
    () => ({
      tip: TipSheet,
    }),
    [],
  );

  return (
    <main className={styles.page}>
      <img
        className={styles.profileBackdrop}
        src={PROFILE_BG}
        alt=""
        aria-hidden="true"
        onError={(event) => {
          if (!event.currentTarget.currentSrc.endsWith("/profile-bg.svg")) {
            event.currentTarget.src = asset("profile-bg.svg");
          }
        }}
      />
      <div className={styles.backdropVignette} aria-hidden="true" />

      <section className={styles.profile} aria-label="JAMMM profile">
        <div className={styles.avatarWrap}>
          <Image
            src={AVATAR}
            alt="JAMMM avatar"
            width="clamp(5.75rem, 24vw, 7rem)"
            height="clamp(5.75rem, 24vw, 7rem)"
            borderRadius="50%"
            objectFit="cover"
            className={styles.avatar}
            onError={(event) => { event.currentTarget.src = asset("avatar.svg"); }}
          />
          <span className={styles.onlineDot} aria-label="online" />
        </div>

        <Text as="h1" type="hero" weight="bold" align="center" className={styles.name}>
          JAMMM
        </Text>
        <Text type="subheadline2" align="center" color="secondary" className={styles.handle}>
          @not_jammm
        </Text>

        <div className={styles.profileActions}>
          <a
            className={styles.profileAction}
            href="https://t.me/devofnot"
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.actionMark}>
              <TelegramPlaneIcon />
            </span>
            <span>Channel</span>
          </a>
          <a
            className={styles.profileAction}
            href="https://notcollective.is-a.dev"
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.actionMark}>
              <AboutIcon />
            </span>
            <span>About</span>
          </a>
        </div>

        <Button
          type="primary"
          onClick={() => setSheetOpen(true)}
          className={styles.tipTrigger}
        >
          Support
        </Button>
      </section>

      <Sheet
        sheets={sheets}
        activeSheet="tip"
        opened={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </main>
  );
}
