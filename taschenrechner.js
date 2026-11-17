function berechne(input)
{
    const tokens = input.match(/\d+\.?\d*|[-+*/()]/g);   //Zerlegt in Zahlen und Zeichen
    if(!tokens) throw new Error("Leere Eingabe");
    let pos = 0;

    //Ausdruck: Summen und Differenz (niedrigste Priorität)
    function ausdruck()
    {
        let wert = term();
        while(tokens[pos] === "+" || tokens[pos] === "-")
        {
            const op = tokens[pos++];
            const rechts = term();
            wert = op === "+" ? wert + rechts : wert - rechts;
        }
        return wert;
    }

    //Term: Produkte und Quotienten (bindet stärker)
    function term()
    {
        let wert = faktor();
        while(tokens[pos] === "*" || tokens[pos] === "/")
        {
            const op = tokens[pos++];
            const rechts = faktor();
            wert = op === "*" ? wert * rechts : wert / rechts;
        }
        return wert;
    }

    //Faktor: Zahl, Klammerausdruck oder negatives Vorzeichen
    function faktor()
    {
        const t = tokens[pos++];
        if(t === "-") return -faktor();
        if(t === "(")
        {
            const wert = ausdruck();
            if(tokens[pos++] !== ")") throw new Error("Klammer fehlt");
            return wert;
        }
        const zahl = Number(t);
        if(t === undefined || Number.isNaN(zahl)) throw new Error("Ungültige Eingabe");
        return zahl;
    }
    const ergebnis = ausdruck();
    if(pos < tokens.length) throw new Error("Ungültige Eingabe");
    return ergebnis;
}

document.querySelector("#rechner").addEventListener("submit", (e) =>
{
    e.preventDefault();
    const ausgabe = document.querySelector("#ergebnis");
    try
    {
        ausgabe.textContent = berechne(document.querySelector("#eingabe").value);
    }
    catch(fehler)
    {
        ausgabe.textContent = fehler.message;
    }
});
