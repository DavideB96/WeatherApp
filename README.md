# ⛅ Previsioni Meteo

Un'applicazione web moderna per consultare le previsioni meteo in tempo reale di qualsiasi città del mondo. Interfaccia elegante con effetto glassmorphism e animazioni fluide.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-API-orange?style=flat)

---

## Panoramica

Previsioni Meteo è un'app leggera e responsive che permette di cercare il meteo corrente di qualsiasi città, mostrando temperatura, temperatura percepita, umidità, velocità e direzione del vento, il tutto con un design curato e animazioni d'ingresso.

## Funzionalità

- **Ricerca per città** — inserisci il nome di una città e ottieni i dati meteo in tempo reale
- **Dati completi** — temperatura, percepita, umidità, velocità e direzione del vento
- **Emoji dinamiche** — icone animate che cambiano in base alle condizioni meteo (sole, pioggia, neve, nebbia, temporale e altre)
- **Descrizioni in italiano** — parametro `lang=it` per ricevere le descrizioni meteo tradotte
- **Ultima ricerca salvata** — al caricamento della pagina viene mostrato il meteo dell'ultima città cercata tramite `localStorage`
- **Gestione errori** — messaggi differenziati per città non trovata e problemi di connessione
- **Design responsive** — layout adattivo per desktop, tablet e mobile
- **Accessibilità** — attributi ARIA, `aria-live` per screen reader, focus states e HTML semantico

## Demo

<img width="936" height="473" alt="Weather App" src="https://github.com/user-attachments/assets/3b8d792c-8c36-4850-bb70-10b216212d89" />


## Tecnologie utilizzate

| Tecnologia | Utilizzo |
|---|---|
| **HTML5** | Struttura semantica con `<main>`, `<header>`, `<section>`, `<footer>` |
| **CSS3** | Glassmorphism, CSS variables, animazioni keyframe, grid layout |
| **JavaScript (ES6+)** | Async/await, Fetch API, template literals, localStorage |
| **OpenWeatherMap API** | Dati meteo in tempo reale |
| **Google Fonts** | Playfair Display + Outfit |

## Installazione

1. **Clona il repository**

   ```bash
   git clone [https://github.com/tuo-username/previsioni-meteo.git](https://github.com/DavideB96/WeatherApp)
   cd previsioni-meteo
   ```

2. **Ottieni una API key gratuita**

   Registrati su [OpenWeatherMap](https://openweathermap.org/api) e genera una API key.

   > ⚠️ Le nuove chiavi possono impiegare fino a 2 ore per attivarsi.

3. **Configura la API key**

   Apri `main.js` e sostituisci il valore nella prima riga:

   ```js
   const API_KEY = 'LA_TUA_API_KEY';
   ```

## Struttura del progetto

```
previsioni-meteo/
├── index.html      # Struttura della pagina
├── style.css       # Stili, animazioni e responsive design
├── main.js         # Logica applicativa e chiamate API
├── screenshot.png  # Screenshot dell'app
└── README.md       # Documentazione
```

## API Reference

L'app utilizza l'endpoint **Current Weather Data** di OpenWeatherMap:

```
GET https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}&units=metric&lang=it
```

| Parametro | Descrizione |
|---|---|
| `q` | Nome della città |
| `appid` | La tua API key |
| `units` | `metric` per gradi Celsius |
| `lang` | `it` per descrizioni in italiano |

Per maggiori dettagli consulta la [documentazione ufficiale](https://openweathermap.org/current).

## Licenza

Questo progetto è distribuito sotto licenza [MIT](https://opensource.org/licenses/MIT). Sei libero di usarlo, modificarlo e distribuirlo.

