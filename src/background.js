const mailRegex = /[\w\-.]+(@| at |\s*\[at]\s*|\s*\(at\)\s*)(?:[\w-]+(\.| dot ))+[\w-]{2,3}/;
const sanitizeMail = (mail) => mail.replace(" at ", "@").replace("[at]", "@").replace("(at)", "@").replace(" dot ", ".")

const content = (fills) => encodeURIComponent(`
Auskunft nach Art. 15 Datenschutz-Grundverordnung (DSGVO)

Geburtsdatum: ${fills.bday}

E-Mail-Adresse: ${fills.mymail}

${fills.address ? "Anschrift: " + fills.address : ''}

Meine IP: ${fills.ip}

Zeitpunkt des Zugriffs: ${(new Date().toGMTString())}


Sehr geehrte Damen und Herren,

ich bitte um Auskunft darüber, ob Sie personenbezogene Daten über meine Person gespeichert haben. Sollte dies der Fall sein, bitte ich um Auskunft darüber,

a) welche personenbezogenen Daten ganz konkret bei Ihnen verarbeitet werden (z.B. Name, Vorname, Anschrift, Geburtsdatum, Beruf, medizinische Befunde) sowie

b) zu welchem Zweck diese Daten verarbeitet werden.

 

Darüber hinaus fordere ich Informationen über

c) die Kategorien personenbezogener Daten, die verarbeitet werden,

d) Empfänger bzw. Kategorien von Empfängern, die diese Daten bereits erhalten haben oder künftig noch erhalten werden,

e) die geplante Speicherdauer bzw. die Kriterien für die Festlegung dieser Dauer,

f) das Bestehen eines Rechts auf Berichtigung oder Löschung der Daten oder auf Einschränkung der Verarbeitung,

g) ein ggf. bestehendes Widerspruchsrecht gegen diese Verarbeitung nach Art. 21 DS-GVO,

h) mein Beschwerderecht bei der zuständigen Aufsichtsbehörde,

i) die Herkunft der Daten.

 

j) Sollte eine automatisierte Entscheidungsfindung einschließlich Profiling stattfinden, bitte ich um aussagekräftige Informationen über die dabei involvierte Logik sowie die Tragweite und die angestrebten Auswirkungen solcher Verfahren,

k) Falls eine Datenübermittlung in Drittländer stattfindet, bitte ich um Informationen, welche Garantien gemäß Art. 46 DSGVO vorgesehen sind.

Bitte stellen Sie mir außerdem kostenfrei eine Kopie meiner bei Ihnen gespeicherten personenbezogenen Daten zur Verfügung.

Dazu setze ich Ihnen eine Frist von einem Monat ab Zugang des Schreibens.

 

Mit freundlichen Grüßen

${fills.name}
`);

function openTab() {
    console.log("write mail")
    ;(async () => {
        const data = await (await fetch('https://ipapi.co/json/')).json();
        const imprintLink = await browser.storage.sync.get("imprintLink")
        const response = await fetch(imprintLink.imprintLink);
        const html = await response.text();
        const ip = data.ip;
        const mymail = (await browser.storage.sync.get("email")).email;
        const name = (await browser.storage.sync.get("name")).name;
        const bday = (await browser.storage.sync.get("bday")).bday;
        const address = (await browser.storage.sync.get("address")).address;
        const email = sanitizeMail(html.match(mailRegex)?.[0]);
        const fills = {name, email, ip, mymail, bday, address, html}

        console.log(fills)

        browser.tabs.create({
            url: `mailto:${email}?subject=Datenauskunft&body=${content(fills)}`,
            active: true
        })

        let checklist = (await browser.storage.sync.get("checklist"))?.checklist ?? [];
        if (checklist
            && Object.keys(checklist).length === 0
            && Object.getPrototypeOf(checklist) === Object.prototype
        ) checklist = []
        browser.storage.sync.set({
            checklist: [...new Set([...checklist, email])]
        })
    })()
}

browser.browserAction.onClicked.addListener(openTab)

