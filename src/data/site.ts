// Facts for the Medplanet homepage. Source: veon/client.json (ids in comments) and design/concept.md.
// Nothing here is invented: no ratings, years on the market, stock counters or 24/7.
import type { ImageMetadata } from "astro";
import militaryMaxi from "../assets/products/military-maxi-35902.webp";
import military from "../assets/products/military-34304.webp";
import amup from "../assets/products/amup-66022.webp";
import steepen from "../assets/products/steepen-184581.png";
import needleHolder from "../assets/products/golkotrymach-164927.jpg";
import oxygen from "../assets/products/kysnevyj-185502.jpg";
import cabinet from "../assets/products/stil-tumba-185522.jpg";
import mine from "../assets/products/tm-62-76450.webp";
import bath from "../assets/products/ub-6-185650.jpg";

export const FUTURE = "Розділ у розробці";

// company.contacts (phones[0], messengers, emails, hours) — R-001
export const contact = {
  phoneDisplay: "095 587 65 16",
  phoneFull: "+38 (095) 587 65 16",
  phoneE164: "+380955876516",
  tel: "tel:+380955876516",
  viber: "viber://chat?number=%2B380955876516",
  telegram: "https://t.me/+380955876516",
  email: "info@medplanet.com.ua",
  hours: [
    "Дзвінки: Пн–Пт 9:00–21:00, Сб–Нд 9:00–18:00",
    "Консультації та месенджери: Пн–Нд 9:00–23:00",
  ],
  city: "Київ",
  legal: "ТОВ «МЕДПЛАНЕТ ЮА»", // B-F001
  edrpou: "45539330",
};

// Letter template for organisations (#b2b, R-005). Shown as a preview, sent from the visitor's own mail app.
export const letter = {
  subject: "Запит рахунку / КП",
  fields: [
    { label: "Організація", value: "" },
    { label: "ЄДРПОУ", value: "" },
    { label: "Перелік і кількість", value: "1. \n2. \n3. " },
    { label: "З ПДВ / без ПДВ", value: "" },
    { label: "Місто доставки", value: "" },
  ],
};

export const mailtoHref = (() => {
  const body = letter.fields.map((f) => `${f.label}: ${f.value}`).join("\n") + "\nКонтактний телефон: \n";
  const enc = (s: string) => encodeURIComponent(s).replace(/%0A/g, "%0D%0A");
  return `mailto:${contact.email}?subject=${enc(letter.subject)}&body=${enc(body)}`;
})();

export interface Direction {
  num: string;
  id: string;
  title: string;
  short: string;
  lead: string;
  subs: string[];
  photo: ImageMetadata;
  alt: string;
  /** photo shot on a grey/beige background: fill the cell edge to edge (no white box inside the white cell) */
  fill?: boolean;
}

// company.business_lines, company.products_services, W-F011
export const directions: Direction[] = [
  {
    num: "01",
    id: "dir-01",
    title: "Тактична медицина",
    short: "Тактична",
    lead: "Аптечки для військових і поліцейських підрозділів, турнікети, кровоспинні засоби, ноші, іммобілізація.",
    subs: ["Аптечки для військових підрозділів", "Аптечки для поліцейських підрозділів", "Комплектуючі до аптечок", "Турнікети", "Кровоспинні засоби", "Ноші", "Іммобілізація"],
    photo: militaryMaxi,
    alt: "Аптечка Military Maxi (військова), розкладка вмісту",
  },
  {
    num: "02",
    id: "dir-02",
    title: "Цивільні аптечки",
    short: "Цивільні",
    lead: "Аптечки для офісу, автомобіля, виробництва і закладів HORECA.",
    subs: ["Аптечка для офісу", "Автомобільна євростандарт", "Виробничі", "Для HORECA", "АМУП", "АМВ", "Універсальна"],
    photo: amup,
    fill: true,
    alt: "Аптечка медична універсальна промислова (АМУП)",
  },
  {
    num: "03",
    id: "dir-03",
    title: "Навчальні макети і тренажери",
    short: "Макети",
    lead: "MEDPLANET x STEEPEN: медичні тренажери, Made in Ukraine. Сертифіковані навчально-тренувальні макети вибухонебезпечних предметів.",
    subs: ["Медичні тренажери STEEPEN", "Навчальні макети вибухонебезпечних предметів"],
    photo: steepen,
    alt: "Імітатор відкритого перелому передпліччя STEEPEN",
    fill: true,
  },
  {
    num: "04",
    id: "dir-04",
    title: "Медичний інструмент",
    short: "Інструмент",
    lead: "Найбільша категорія каталогу.",
    subs: ["Відеоларингоскопи", "Голкотримачі", "Голки хірургічні", "Набори інструментів"],
    photo: needleHolder,
    alt: "Голкотримач-ножиці з твердосплавними браншами, 160 мм",
  },
  {
    num: "05",
    id: "dir-05",
    title: "Медичне обладнання",
    short: "Обладнання",
    lead: "Продаж і сервіс медичного обладнання.",
    subs: ["Електрообладнання", "Кисневе обладнання", "Лабораторне обладнання", "Іммобілізація і реабілітація"],
    photo: oxygen,
    fill: true,
    alt: "Кисневий концентратор «БІОМЕД» JAY1 з акумулятором",
  },
  {
    num: "06",
    id: "dir-06",
    title: "Медичні меблі",
    short: "Меблі",
    lead: "Лабораторні столи, маніпуляційні столи-тумби, санітарне оснащення.",
    subs: ["Лабораторні столи", "Санітарне оснащення"],
    photo: cabinet,
    alt: "Стіл-тумба маніпуляційний пересувний C.box ТСМ-6-NATA SL",
  },
];

// Panel photos for 01 and 02 in #directions (different shots from the hero kit)
export const panelPhotos: Record<string, { photo: ImageMetadata; alt: string; fill?: boolean }> = {
  "dir-01": { photo: military, alt: "Аптечка Military (військова), розкладка вмісту" },
  "dir-02": { photo: amup, alt: "Аптечка медична універсальна промислова (АМУП)", fill: true },
};

export interface Product {
  name: string;
  code: string;
  price: number;
  oldPrice?: number;
  photo: ImageMetadata;
  fill?: boolean;
}

// content/client-assets/products/manifest.md — prices on 20.11.2026
export const products: Product[] = [
  { name: "Аптечка Military Maxi (військова)", code: "35902", price: 3750, oldPrice: 4200, photo: militaryMaxi },
  { name: "Макет протитанкової навчальної міни ТМ-62", code: "76450", price: 4640, oldPrice: 5800, photo: mine, fill: true },
  { name: "Кисневий концентратор «БІОМЕД» JAY1 з акумулятором", code: "185502", price: 28215, photo: oxygen, fill: true },
  { name: "Ультразвукова ванна UB-6.0", code: "185650", price: 22470, photo: bath },
];

export const formatPrice = (n: number) => `${n.toLocaleString("uk-UA").replace(/\s/g, " ")} ₴`;
