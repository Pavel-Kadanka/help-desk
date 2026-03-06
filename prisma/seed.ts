import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@helpdesk.cz' },
    update: {},
    create: {
      email: 'admin@helpdesk.cz',
      passwordHash: adminPassword,
      name: 'Administrátor',
      role: 'admin',
    },
  })

  // Create test user
  const userPassword = await bcrypt.hash('user123', 12)
  await prisma.user.upsert({
    where: { email: 'student@helpdesk.cz' },
    update: {},
    create: {
      email: 'student@helpdesk.cz',
      passwordHash: userPassword,
      name: 'Testovací Student',
      role: 'user',
    },
  })

  // Create categories
  const studijniMaterialy = await prisma.category.upsert({
    where: { slug: 'studijni-materialy' },
    update: {},
    create: {
      name: 'Studijní materiály',
      slug: 'studijni-materialy',
      sortOrder: 1,
    },
  })

  const predpisy = await prisma.category.upsert({
    where: { slug: 'predpisy' },
    update: {},
    create: {
      name: 'Předpisy',
      slug: 'predpisy',
      sortOrder: 2,
    },
  })

  const navody = await prisma.category.upsert({
    where: { slug: 'navody' },
    update: {},
    create: {
      name: 'Návody',
      slug: 'navody',
      sortOrder: 3,
    },
  })

  // Okruh 13
  await prisma.topic.upsert({
    where: { slug: 'okruh-13-historie-it' },
    update: {},
    create: {
      categoryId: studijniMaterialy.id,
      title: '13. Historie a nové trendy v informačních technologiích',
      slug: 'okruh-13-historie-it',
      summary: 'Vývoj výpočetní techniky od počátků po současnost, generace počítačů, moderní trendy jako AI, cloud computing a IoT.',
      sortOrder: 13,
      content: `
<h2 id="struktura-html">Struktura HTML dokumentu</h2>
<p>Každý HTML dokument má pevně danou strukturu, která se skládá z deklarace DOCTYPE, elementu html, head a body.</p>

<pre><code class="language-html">&lt;!DOCTYPE html&gt;
&lt;html lang="cs"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;Můj web&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Ahoj světe!&lt;/h1&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

<h2 id="zakladni-znacky">Základní HTML značky</h2>
<p>HTML obsahuje řadu sémantických značek pro strukturování obsahu:</p>
<ul>
  <li><code>&lt;h1&gt;</code> až <code>&lt;h6&gt;</code> - nadpisy</li>
  <li><code>&lt;p&gt;</code> - odstavec</li>
  <li><code>&lt;a&gt;</code> - odkaz</li>
  <li><code>&lt;img&gt;</code> - obrázek</li>
  <li><code>&lt;ul&gt;</code>, <code>&lt;ol&gt;</code>, <code>&lt;li&gt;</code> - seznamy</li>
  <li><code>&lt;div&gt;</code> - blokový kontejner</li>
  <li><code>&lt;span&gt;</code> - řádkový kontejner</li>
</ul>

<h2 id="css-selektory">CSS Selektory</h2>
<p>CSS selektory určují, na které elementy se budou aplikovat styly.</p>

<pre><code class="language-css">/* Selektor elementu */
p {
    color: #333;
    line-height: 1.6;
}

/* Selektor třídy */
.highlight {
    background-color: yellow;
    padding: 4px 8px;
}

/* Selektor ID */
#hlavni-nadpis {
    font-size: 2rem;
    font-weight: bold;
}

/* Kombinovaný selektor */
nav a:hover {
    color: blue;
    text-decoration: underline;
}</code></pre>

<h2 id="box-model">Box Model</h2>
<p>Každý HTML element je reprezentován jako obdélníkový box, který se skládá z obsahu (content), vnitřního okraje (padding), rámečku (border) a vnějšího okraje (margin).</p>

<pre><code class="language-css">.box {
    width: 300px;
    padding: 20px;
    border: 1px solid #ccc;
    margin: 10px;
    box-sizing: border-box; /* Zahrnuje padding a border do width */
}</code></pre>
      `,
    },
  })

  await prisma.topic.upsert({
    where: { slug: 'javascript-zaklady' },
    update: {},
    create: {
      categoryId: studijniMaterialy.id,
      title: 'JavaScript - Základy',
      slug: 'javascript-zaklady',
      summary: 'Proměnné, datové typy, funkce, DOM manipulace a události.',
      sortOrder: 2,
      content: `
<h2 id="promenne">Proměnné a datové typy</h2>
<p>JavaScript má tři způsoby deklarace proměnných: <code>var</code>, <code>let</code> a <code>const</code>.</p>

<pre><code class="language-javascript">// let - proměnná, která se může změnit
let jmeno = "Jan";
let vek = 18;

// const - konstanta, nelze přeřadit
const PI = 3.14159;
const barvy = ["červená", "zelená", "modrá"];

// Datové typy
let cislo = 42;           // number
let text = "Ahoj";        // string
let pravda = true;         // boolean
let nic = null;            // null
let nedefinovano;          // undefined
let pole = [1, 2, 3];     // array (object)
let objekt = {             // object
    jmeno: "Jan",
    vek: 18
};</code></pre>

<h2 id="funkce">Funkce</h2>
<p>Funkce jsou základním stavebním kamenem JavaScriptu.</p>

<pre><code class="language-javascript">// Klasická funkce
function pozdrav(jmeno) {
    return "Ahoj, " + jmeno + "!";
}

// Arrow funkce (ES6+)
const soucet = (a, b) => a + b;

// Arrow funkce s tělem
const vypocitejDan = (cena, sazba = 0.21) => {
    const dan = cena * sazba;
    return {
        cena: cena,
        dan: dan,
        celkem: cena + dan
    };
};</code></pre>

<h2 id="dom-manipulace">DOM Manipulace</h2>
<p>Document Object Model (DOM) umožňuje JavaScriptu měnit obsah a strukturu stránky.</p>

<pre><code class="language-javascript">// Výběr elementů
const nadpis = document.getElementById("hlavni-nadpis");
const odstavce = document.querySelectorAll("p");
const tlacitko = document.querySelector(".btn-primary");

// Změna obsahu
nadpis.textContent = "Nový nadpis";
nadpis.innerHTML = "&lt;em&gt;Kurzíva&lt;/em&gt; nadpis";

// Změna stylu
nadpis.style.color = "red";
nadpis.classList.add("aktivni");

// Vytvoření nového elementu
const novyElement = document.createElement("div");
novyElement.textContent = "Nový obsah";
document.body.appendChild(novyElement);</code></pre>

<h2 id="udalosti">Události</h2>
<p>Události umožňují reagovat na akce uživatele.</p>

<pre><code class="language-javascript">// Kliknutí
tlacitko.addEventListener("click", () => {
    alert("Tlačítko bylo kliknuto!");
});

// Odeslání formuláře
const formular = document.querySelector("form");
formular.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(formular);
    console.log(data.get("jmeno"));
});</code></pre>
      `,
    },
  })

  await prisma.topic.upsert({
    where: { slug: 'databaze-sql' },
    update: {},
    create: {
      categoryId: studijniMaterialy.id,
      title: 'Databáze a SQL',
      slug: 'databaze-sql',
      summary: 'Relační databáze, SQL příkazy SELECT, INSERT, UPDATE, DELETE, JOIN.',
      sortOrder: 3,
      content: `
<h2 id="relacni-databaze">Relační databáze</h2>
<p>Relační databáze ukládají data v tabulkách, které jsou propojeny relacemi. Nejpoužívanější databázové systémy jsou MySQL, PostgreSQL a SQLite.</p>

<h2 id="select">Příkaz SELECT</h2>
<p>SELECT slouží k načtení dat z databáze.</p>

<pre><code class="language-sql">-- Výběr všech sloupců
SELECT * FROM studenti;

-- Výběr konkrétních sloupců s podmínkou
SELECT jmeno, prijmeni, email
FROM studenti
WHERE rocnik = 4
ORDER BY prijmeni ASC;

-- Agregační funkce
SELECT rocnik, COUNT(*) as pocet, AVG(prumer) as prumerny_prumer
FROM studenti
GROUP BY rocnik
HAVING COUNT(*) > 5;</code></pre>

<h2 id="insert-update-delete">INSERT, UPDATE, DELETE</h2>

<pre><code class="language-sql">-- Vložení záznamu
INSERT INTO studenti (jmeno, prijmeni, email, rocnik)
VALUES ('Jan', 'Novák', 'jan.novak@skola.cz', 4);

-- Aktualizace záznamu
UPDATE studenti
SET email = 'novy.email@skola.cz'
WHERE id = 1;

-- Smazání záznamu
DELETE FROM studenti
WHERE id = 1;</code></pre>

<h2 id="join">JOIN - Spojení tabulek</h2>
<p>JOIN umožňuje spojit data z více tabulek.</p>

<pre><code class="language-sql">-- INNER JOIN - vrátí jen odpovídající záznamy
SELECT s.jmeno, s.prijmeni, t.nazev AS trida
FROM studenti s
INNER JOIN tridy t ON s.trida_id = t.id;

-- LEFT JOIN - vrátí všechny záznamy z levé tabulky
SELECT s.jmeno, z.predmet, z.znamka
FROM studenti s
LEFT JOIN znamky z ON s.id = z.student_id
ORDER BY s.prijmeni;</code></pre>
      `,
    },
  })

  // Predpisy topic
  await prisma.topic.upsert({
    where: { slug: 'maturitni-predpisy' },
    update: {},
    create: {
      categoryId: predpisy.id,
      title: 'Maturitní předpisy a pravidla',
      slug: 'maturitni-predpisy',
      summary: 'Přehled pravidel pro maturitní zkoušku, povolené pomůcky a průběh.',
      sortOrder: 1,
      content: `
<h2 id="pruběh-maturity">Průběh maturitní zkoušky</h2>
<p>Maturitní zkouška se skládá ze společné (státní) a profilové (školní) části. Obě části jsou povinné a student musí úspěšně složit obě.</p>

<h2 id="spolecna-cast">Společná část</h2>
<ul>
  <li>Český jazyk a literatura - didaktický test</li>
  <li>Cizí jazyk nebo matematika - didaktický test</li>
</ul>

<h2 id="profilova-cast">Profilová část</h2>
<p>Profilová část se řídí předpisy školy a zahrnuje:</p>
<ul>
  <li>Povinné zkoušky stanovené školou</li>
  <li>Praktická zkouška z odborných předmětů</li>
  <li>Obhajoba maturitní práce (pokud je vyžadována)</li>
</ul>

<h2 id="povolene-pomucky">Povolené pomůcky</h2>
<p>Během zkoušek je povoleno používat pouze schválené pomůcky dle vyhlášky.</p>
      `,
    },
  })

  // Navody topic
  await prisma.topic.upsert({
    where: { slug: 'jak-se-pripravit' },
    update: {},
    create: {
      categoryId: navody.id,
      title: 'Jak se efektivně připravit na maturitu',
      slug: 'jak-se-pripravit',
      summary: 'Tipy a rady pro efektivní přípravu na maturitní zkoušku.',
      sortOrder: 1,
      content: `
<h2 id="planovani">Plánování přípravy</h2>
<p>Začněte s přípravou včas - ideálně alespoň 3 měsíce před termínem zkoušky. Vytvořte si studijní plán a rozdělte si látku do menších celků.</p>

<h2 id="studijni-techniky">Studijní techniky</h2>
<ul>
  <li><strong>Aktivní opakování</strong> - testujte se místo pasivního čtení</li>
  <li><strong>Spaced repetition</strong> - opakujte v rostoucích intervalech</li>
  <li><strong>Pomodoro technika</strong> - 25 minut práce, 5 minut pauza</li>
  <li><strong>Výpisky a myšlenkové mapy</strong> - vizualizujte souvislosti</li>
</ul>

<h2 id="pred-zkouskou">Den před zkouškou</h2>
<p>Neopakujte celou noc! Dospěte se, připravte si pomůcky a doklady. Ráno snídejte a přijďte s předstihem.</p>
      `,
    },
  })

  // Create deadlines
  const deadlines = [
    {
      title: 'Odevzdání maturitní práce',
      description: 'Odevzdání hotové maturitní práce v tištěné i elektronické podobě.',
      dueDate: new Date('2026-03-31'),
      sortOrder: 1,
    },
    {
      title: 'Didaktické testy (společná část)',
      description: 'Termín konání didaktických testů společné části maturitní zkoušky.',
      dueDate: new Date('2026-05-04'),
      sortOrder: 2,
    },
    {
      title: 'Praktická zkouška z odborných předmětů',
      description: 'Praktická maturitní zkouška z SWA a dalších odborných předmětů.',
      dueDate: new Date('2026-05-11'),
      sortOrder: 3,
    },
    {
      title: 'Ústní zkoušky (profilová část)',
      description: 'Ústní maturitní zkoušky před zkušební komisí.',
      dueDate: new Date('2026-05-26'),
      sortOrder: 4,
    },
    {
      title: 'Slavnostní předání vysvědčení',
      description: 'Slavnostní ceremoniál předání maturitních vysvědčení.',
      dueDate: new Date('2026-06-15'),
      sortOrder: 5,
    },
  ]

  for (const deadline of deadlines) {
    await prisma.deadline.create({ data: deadline })
  }

  // Create FAQ
  const faqs = [
    {
      question: 'Jak se přihlásit do systému?',
      answer: 'Na stránce přihlášení zadejte svůj e-mail a heslo. Pokud ještě nemáte účet, klikněte na "Registrace" a vytvořte si nový účet.',
      sortOrder: 1,
    },
    {
      question: 'Kdy je termín odevzdání maturitní práce?',
      answer: 'Termín odevzdání maturitní práce najdete v sekci "Předpisy a termíny". Obvykle je to konec března aktuálního školního roku.',
      sortOrder: 2,
    },
    {
      question: 'Jak obnovím zapomenuté heslo?',
      answer: 'Na přihlašovací stránce klikněte na odkaz "Zapomenuté heslo". Zadejte svůj e-mail a obdržíte odkaz pro nastavení nového hesla.',
      sortOrder: 3,
    },
    {
      question: 'Které předměty maturitní okruhy pokrývají?',
      answer: 'Aktuálně jsou k dispozici studijní materiály pro předmět SWA (Softwarové aplikace). Další předměty budou přidány postupně.',
      sortOrder: 4,
    },
    {
      question: 'Mohu si materiály stáhnout jako PDF?',
      answer: 'Materiály jsou dostupné pouze online přímo v aplikaci. Pro offline přístup doporučujeme si stránku uložit přes prohlížeč (Ctrl+S).',
      sortOrder: 5,
    },
    {
      question: 'Jak kontaktovat správce systému?',
      answer: 'V případě technických problémů kontaktujte správce na e-mailu admin@helpdesk.cz nebo se obraťte na svého třídního učitele.',
      sortOrder: 6,
    },
    {
      question: 'Je systém přístupný z mobilu?',
      answer: 'Ano, webová aplikace je plně responzivní a funguje na mobilních telefonech i tabletech.',
      sortOrder: 7,
    },
  ]

  for (const faq of faqs) {
    await prisma.faq.create({ data: faq })
  }

  console.log('Seed data created successfully!')
  console.log('Admin login: admin@helpdesk.cz / admin123')
  console.log('User login: student@helpdesk.cz / user123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
