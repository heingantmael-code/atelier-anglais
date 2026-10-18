// ====== TEXTES DE LECTURE ======
// gloss : « mot=traduction; … » (mots tels qu'ils apparaissent, en minuscules)
// q : « question|bonne réponse|mauvaise|mauvaise »
function TX(id, part, lvl, title, text, gloss, q) {
  const g = {};
  gloss.split(";").forEach(p => { const i = p.indexOf("="); if (i > 0) g[p.slice(0, i).trim().toLowerCase()] = p.slice(i + 1).trim(); });
  return {id, part, lvl, title, text: text.trim(), gloss: g, q: q.trim().split("\n").map(l => { const [qq, ...o] = l.split("|").map(s => s.trim()); return {q: qq, o, a: 0}; })};
}
const TEXTS = [
TX("t_new_flat","daily","A2","My new flat",`
Last month, I moved into a new flat in the city centre. It's on the third floor of an old building, and unfortunately there's no lift, so I carry my shopping up the stairs every day. The flat is small but very bright: the living room has two big windows and a balcony with a view of the park.
The rent is a bit expensive, but the bills are included. My landlord is a friendly old man who lives on the ground floor. When the kitchen tap started leaking last week, he called a plumber the same day.
The only problem is my neighbour. He plays the drums late at night! I haven't complained yet, but I'm going to talk to him this weekend. I hope we can find a solution.`,
`moved into=ai emménagé dans; flat=appartement; building=immeuble; floor=étage; unfortunately=malheureusement; lift=ascenseur; carry=porte; shopping=courses; stairs=escaliers; bright=lumineux; living room=salon; windows=fenêtres; balcony=balcon; view=vue; rent=loyer; a bit=un peu; bills=charges / factures; included=compris; landlord=propriétaire; friendly=sympathique; ground floor=rez-de-chaussée; tap=robinet; leaking=fuir; plumber=plombier; same=même; neighbour=voisin; drums=batterie (instrument); late=tard; complained=me suis plaint; yet=encore (pas encore); weekend=week-end; hope=espère; solution=solution; city centre=centre-ville; started=a commencé; called=a appelé; problem=problème; only=seul`,
`Where is the flat?|In the city centre|Near the airport|In the countryside
Why does the writer carry the shopping up the stairs?|There is no lift|The lift is too small|He wants to do exercise
What is the problem with the neighbour?|He plays the drums late at night|He never says hello|He has a big dog`),
TX("t_morning","daily","A1","A normal morning",`
My alarm goes off at half past six. I usually stay in bed for five more minutes, then I get up and have a shower. For breakfast, I have coffee with milk and two slices of toast with butter and jam.
I leave home at quarter past seven and walk to the bus stop. The bus is often late, so I read the news on my phone while I wait. I arrive at the office at eight. My colleagues are friendly, and we always have a quick chat before we start working.`,
`alarm=réveil; goes off=sonne; half past six=six heures et demie; usually=d'habitude; stay=reste; get up=me lève; shower=douche; breakfast=petit-déjeuner; milk=lait; slices=tranches; toast=pain grillé; butter=beurre; jam=confiture; leave=quitte; quarter past seven=sept heures et quart; walk=marche; bus stop=arrêt de bus; often=souvent; late=en retard; news=informations; while=pendant que; wait=attends; arrive=arrive; office=bureau; colleagues=collègues; friendly=sympathiques; always=toujours; quick=rapide; chat=discussion; start=commencer; working=travailler`,
`What time does the alarm go off?|6:30|7:15|8:00
What does the writer do while waiting for the bus?|Reads the news on the phone|Drinks a coffee|Calls a colleague
How does the writer go to the bus stop?|On foot|By car|By bike`),
TX("t_doctor","daily","B1","At the doctor's",`
I had been feeling tired for a couple of weeks, so I finally made an appointment with my GP. The receptionist offered me a slot on Tuesday morning, which was perfect because I work from home on Tuesdays.
The doctor asked me about my symptoms: headaches, a sore throat and trouble sleeping. She checked my blood pressure and listened to my chest. According to her, it was probably just a virus combined with stress. She gave me a prescription for some painkillers and advised me to rest, drink plenty of water and avoid screens before going to bed.
She also suggested a blood test, just to be sure. If I'm not feeling better in ten days, I have to go back and see her.`,
`had been feeling=me sentais depuis; tired=fatigué; a couple of=deux / quelques; finally=finalement; appointment=rendez-vous; gp=médecin généraliste; receptionist=secrétaire / réceptionniste; offered=a proposé; slot=créneau; symptoms=symptômes; headaches=maux de tête; sore throat=mal de gorge; trouble sleeping=difficultés à dormir; checked=a vérifié; blood pressure=tension artérielle; chest=poitrine; according to=selon; probably=probablement; combined with=associé à; prescription=ordonnance; painkillers=antidouleurs; advised=a conseillé; rest=me reposer; plenty of=beaucoup de; avoid=éviter; screens=écrans; suggested=a suggéré; blood test=prise de sang; to be sure=pour être sûr; feeling better=aller mieux; go back=retourner; virus=virus; stress=stress`,
`Why did the writer choose Tuesday?|Because he works from home on Tuesdays|Because the doctor only works on Tuesdays|Because it was the cheapest day
What did the doctor think the problem was?|A virus combined with stress|A broken arm|An allergy
What should the writer do if he doesn't feel better?|Go back to see the doctor|Go to the hospital|Stop the painkillers`),
TX("t_directions","daily","A2","Lost in Manchester",`
Yesterday I got lost in Manchester. I was looking for a small Italian restaurant where I was meeting a friend, but my phone battery was dead, so I couldn't use the map.
I asked a woman at the bus stop. She was very kind. "Go straight on until you reach the traffic lights," she said, "then turn left. Walk past the bank and the post office, and the restaurant is on the corner, opposite the park. It's about a ten-minute walk."
I followed her directions and arrived only five minutes late. My friend laughed and said, "Next time, bring a charger!"`,
`got lost=me suis perdu; looking for=cherchais; meeting=retrouvais; battery=batterie; dead=à plat; couldn't=ne pouvais pas; map=carte / plan; asked=ai demandé; kind=gentille; go straight on=allez tout droit; until=jusqu'à ce que; reach=atteignez; traffic lights=feux; turn left=tournez à gauche; walk past=passez devant; post office=bureau de poste; corner=coin; opposite=en face de; about=environ; followed=ai suivi; directions=indications; arrived=suis arrivé; late=en retard; laughed=a ri; next time=la prochaine fois; bring=apporte; charger=chargeur; friend=ami; bank=banque`,
`Why couldn't the writer use the map?|His phone battery was dead|He didn't have a phone|The map was wrong
Where exactly is the restaurant?|On the corner, opposite the park|Next to the bus stop|Behind the bank
How late was the writer?|Five minutes|Ten minutes|Half an hour`),
TX("t_weekend","daily","B1","A weekend in the countryside",`
Last weekend, my partner and I decided to escape the city. We rented a small cottage in the countryside, about two hours from home. As soon as we arrived, we turned off our phones and went for a long walk along the river.
On Saturday it rained all afternoon, so we stayed inside, played board games and cooked a huge pot of vegetable soup. On Sunday the weather was much better. We hired bikes and cycled to a nearby village, where there was a farmers' market. We bought some local cheese, fresh bread and honey.
It wasn't an exciting trip, but it was exactly what we needed: no emails, no traffic, no noise. We've already booked the same cottage for next spring.`,
`partner=compagne / compagnon; decided=avons décidé; escape=fuir / s'échapper de; rented=avons loué; cottage=petite maison de campagne; countryside=campagne; as soon as=dès que; turned off=avons éteint; went for a walk=sommes allés nous promener; along=le long de; river=rivière; stayed inside=sommes restés à l'intérieur; board games=jeux de société; huge=énorme; pot=marmite; soup=soupe; weather=temps; hired=avons loué; bikes=vélos; cycled=sommes allés à vélo; nearby=voisin / proche; village=village; farmers' market=marché de producteurs; local=local; fresh=frais; honey=miel; exciting=palpitant; exactly=exactement; needed=avions besoin; traffic=circulation; noise=bruit; already=déjà; booked=avons réservé; spring=printemps; vegetable=légumes; cheese=fromage; bread=pain`,
`What did they do on Saturday?|Stayed inside because of the rain|Cycled to a village|Went to the market
What did they buy at the market?|Cheese, bread and honey|Vegetables and wine|Bikes and maps
What are they planning for next spring?|To go back to the same cottage|To move to the countryside|To buy a cottage`),
TX("t_complaint_neighbour","daily","B2","Living with flatmates",`
Sharing a flat with three other people can be great fun, but it isn't always easy. When I first moved in, we didn't have any rules, and within a month the kitchen was a mess. Nobody did the dishes, the bins were overflowing and we kept running out of toilet paper.
Eventually, we sat down together and came up with a rota. Each person is responsible for one task per week: cleaning the bathroom, taking out the rubbish, hoovering the common areas or doing the shared shopping. We also set up a group chat to sort out problems before they turn into arguments.
It's not perfect, of course. Some weeks people forget, and we still argue about the heating. But overall, the atmosphere has improved a lot, and I've realised that living with others is mainly about communication.`,
`sharing=partager; flat=appartement; fun=amusant; rules=règles; within=en moins de; mess=désordre / bazar; nobody=personne; did the dishes=faisait la vaisselle; bins=poubelles; overflowing=débordaient; kept=n'arrêtions pas de; running out of=manquer de; toilet paper=papier toilette; eventually=finalement; came up with=avons trouvé / mis au point; rota=planning de tâches (tour de rôle); responsible for=responsable de; task=tâche; rubbish=ordures; hoovering=passer l'aspirateur; common areas=parties communes; shared=commun / partagé; set up=avons créé; group chat=discussion de groupe; sort out=régler; turn into=se transformer en; arguments=disputes; argue=nous disputons; heating=chauffage; overall=dans l'ensemble; atmosphere=ambiance; improved=s'est améliorée; realised=me suis rendu compte; mainly=surtout / principalement; communication=communication; forget=oublient`,
`What was the situation after one month?|The kitchen was a mess|Everyone was very tidy|One flatmate moved out
What did they create to share the tasks?|A rota|A contract with the landlord|A cleaning company account
According to the writer, what is the key to living with others?|Communication|Money|Having separate kitchens`),
TX("t_b_newjob","business","A2","First day at a new company",`
Today was my first day as a sales assistant at a small company that sells office furniture. My manager, Laura, showed me around the building and introduced me to the team. There are twelve people in the sales department and five in customer service.
In the morning, I had training on the company's software. I learned how to create a quote, check stock levels and place an order for a customer. In the afternoon, I listened to Laura's phone calls with clients. She explained our prices, offered discounts for large orders and always followed up with an email.
I was tired at the end of the day, but everyone was very helpful. Tomorrow I'm going to make my first calls.`,
`first day=premier jour; sales assistant=assistant commercial; company=entreprise; sells=vend; office furniture=mobilier de bureau; manager=responsable; showed me around=m'a fait visiter; introduced=a présenté; team=équipe; sales department=service commercial; customer service=service client; training=formation; software=logiciel; learned=ai appris; create=créer; quote=devis; check=vérifier; stock levels=niveaux de stock; place an order=passer une commande; customer=client; listened to=ai écouté; phone calls=appels téléphoniques; clients=clients; explained=a expliqué; prices=prix; offered=proposait; discounts=remises; large orders=grosses commandes; followed up=faisait un suivi / relançait; tired=fatigué; helpful=serviable; tomorrow=demain; calls=appels`,
`What does the company sell?|Office furniture|Computers|Phone services
What did the writer learn in the morning?|How to use the company's software|How to repair furniture|How to write a contract
What did Laura always do after a call?|She followed up with an email|She sent a gift|She called the manager`),
TX("t_b_supplier","business","B1","A problem with a supplier",`
Dear Mr Patel,
I am writing with reference to our order number 4521, which was due to be delivered on 3 March. Unfortunately, the goods have still not arrived, and your tracking number shows no update since last Friday.
This delay is causing us serious problems, as we promised these products to several of our own customers. We would be grateful if you could confirm a new delivery date as soon as possible.
In addition, two pallets from our previous shipment were damaged during transport. Please find attached photos of the damaged items. We would like to request either a replacement or a refund.
We have worked with your company for many years and have always been satisfied with your service, so we hope this situation can be resolved quickly.
I look forward to hearing from you.
Kind regards,
Sophie Martin
Purchasing Manager`,
`dear=cher / madame, monsieur; i am writing=je vous écris; with reference to=au sujet de / en référence à; order number=numéro de commande; due to be delivered=devait être livrée; unfortunately=malheureusement; goods=marchandises; arrived=arrivé; tracking number=numéro de suivi; update=mise à jour; since=depuis; delay=retard; causing=cause; serious=sérieux / graves; as=car / comme; promised=avons promis; products=produits; several=plusieurs; we would be grateful if=nous vous serions reconnaissants de; confirm=confirmer; delivery date=date de livraison; as soon as possible=dès que possible; in addition=de plus; pallets=palettes; previous=précédente; shipment=livraison / expédition; damaged=endommagées; during=pendant; transport=transport; please find attached=veuillez trouver ci-joint; items=articles; request=demander; either=soit; replacement=remplacement; refund=remboursement; satisfied=satisfaits; service=service; hope=espérons; resolved=résolue; quickly=rapidement; i look forward to hearing from you=dans l'attente de votre réponse; kind regards=cordialement; purchasing manager=responsable des achats`,
`Why is Sophie writing?|An order has not been delivered|She wants to place a new order|She wants to cancel the contract
What happened to the previous shipment?|Two pallets were damaged|It arrived too early|It was sent to the wrong address
What does Sophie want for the damaged items?|A replacement or a refund|A discount on the next order|A visit from Mr Patel`),
TX("t_b_meeting","business","B1","The monthly sales meeting",`
The monthly sales meeting started at nine sharp. First, the sales director presented the figures for the last quarter. Overall, revenue increased by eight per cent compared to the same period last year, mainly thanks to two new clients in Germany. However, sales in the UK dropped slightly, and the team still hasn't reached its annual target.
Then we discussed the reasons. According to Tom, our main competitor has lowered its prices, and some customers have switched. Anna suggested that, instead of cutting prices, we should focus on customer service and offer faster delivery times.
At the end of the meeting, the director summarised the action points: Tom will analyse the competitor's offers, Anna will prepare a proposal for express delivery, and everyone will contact their five biggest clients before the end of the month.`,
`monthly=mensuelle; started=a commencé; sharp=pile (heure exacte); sales director=directeur commercial; presented=a présenté; figures=chiffres; quarter=trimestre; overall=dans l'ensemble; revenue=chiffre d'affaires; increased=a augmenté; per cent=pour cent; compared to=par rapport à; period=période; mainly=principalement; thanks to=grâce à; clients=clients; however=cependant; dropped=ont baissé; slightly=légèrement; reached=atteint; annual target=objectif annuel; discussed=avons discuté; reasons=raisons; according to=selon; main competitor=principal concurrent; lowered=a baissé; switched=sont passés (à la concurrence); suggested=a suggéré; instead of=au lieu de; cutting prices=baisser les prix; focus on=se concentrer sur; customer service=service client; faster=plus rapides; delivery times=délais de livraison; summarised=a résumé; action points=actions à mener; analyse=analyser; offers=offres; prepare=préparer; proposal=proposition; express delivery=livraison express; contact=contacter; biggest=plus gros; end of the month=fin du mois`,
`How did revenue change?|It increased by eight per cent|It dropped by eight per cent|It stayed the same
Why did some UK customers leave?|The main competitor lowered its prices|The delivery times were too long|The products were faulty
What will Anna do?|Prepare a proposal for express delivery|Analyse the competitor's offers|Visit the German clients`),
TX("t_b_nego","business","B2","Negotiating a contract",`
Last week we negotiated a two-year supply contract with a large hotel chain. They wanted a fifteen per cent discount on our standard prices, which was impossible for us: our margins are already quite low.
Instead of saying no, we asked questions to understand their real priorities. It turned out that price was not their only concern. They had had problems with late deliveries from their previous supplier, and reliability mattered more to them than anything else.
So we made a counter-offer: a seven per cent discount, guaranteed delivery within 48 hours, and a penalty clause if we fail to meet that commitment. In exchange, they agreed to a minimum order volume and payment within thirty days.
After two meetings, we reached an agreement that works for both sides. It was a good reminder that a successful negotiation is not about winning, but about finding a deal that both parties can live with.`,
`negotiated=avons négocié; supply contract=contrat d'approvisionnement; hotel chain=chaîne d'hôtels; discount=remise; standard prices=prix standard; impossible=impossible; margins=marges; already=déjà; quite=assez; low=faibles; instead of=au lieu de; priorities=priorités; it turned out that=il s'est avéré que; concern=préoccupation; late deliveries=retards de livraison; previous supplier=ancien fournisseur; reliability=fiabilité; mattered=comptait; counter-offer=contre-proposition; guaranteed=garantie; within=sous / dans un délai de; penalty clause=clause de pénalité; fail to=ne pas réussir à; meet=respecter; commitment=engagement; in exchange=en échange; agreed to=ont accepté; minimum order volume=volume de commande minimum; payment=paiement; reached an agreement=sommes parvenus à un accord; both sides=les deux parties; reminder=rappel; successful=réussie; winning=gagner; deal=accord; parties=parties; live with=accepter / s'accommoder de; meetings=réunions`,
`What did the hotel chain want at first?|A fifteen per cent discount|Faster payment terms|A three-year contract
What mattered most to the hotel chain?|Reliability of deliveries|The lowest price|The quality of the packaging
What did the hotel chain accept in exchange?|A minimum order volume and payment within thirty days|A higher price|A shorter contract`),
TX("t_b_launch","business","B1","Launching a new product",`
Our company is launching a new range of reusable water bottles next month. Before the launch, the marketing team carried out market research with 800 consumers. The survey showed that our target audience, people aged 20 to 35, care about two things: design and the environment.
As a result, the campaign will focus on social media rather than traditional advertising. We are working with several influencers who share our values, and we will run online ads for six weeks. We will also have a stand at a trade fair in Berlin to meet distributors.
The budget is limited, so we will measure everything: website traffic, conversion rate and customer reviews. If the results are good, we will extend the range to lunch boxes and travel mugs next year.`,
`launching=lance; range=gamme; reusable=réutilisables; water bottles=gourdes; launch=lancement; marketing team=équipe marketing; carried out=a réalisé; market research=étude de marché; consumers=consommateurs; survey=enquête; showed=a montré; target audience=public cible; aged=âgés de; care about=accordent de l'importance à; design=design; environment=environnement; as a result=par conséquent; campaign=campagne; focus on=se concentrer sur; rather than=plutôt que; traditional advertising=publicité traditionnelle; several=plusieurs; influencers=influenceurs; share=partagent; values=valeurs; run=diffuser; online ads=publicités en ligne; stand=stand; trade fair=salon professionnel; distributors=distributeurs; budget=budget; limited=limité; measure=mesurer; website traffic=trafic du site; conversion rate=taux de conversion; customer reviews=avis clients; results=résultats; extend=étendre; lunch boxes=boîtes à repas; travel mugs=mugs de voyage`,
`What are the two things the target audience cares about?|Design and the environment|Price and quality|Colour and size
Where will the campaign focus?|On social media|On TV and radio|On newspapers
What will the company do if the results are good?|Extend the range|Lower the prices|Stop the online ads`),
TX("t_b_customer","business","A2","A phone call to customer service",`
- Good morning, Brightline customer service, Emma speaking. How can I help you?
- Hello. I ordered a coffee machine on your website ten days ago, but it still hasn't arrived.
- I'm sorry to hear that. Could you give me your order number, please?
- Yes, it's B-7734.
- Thank you. Let me check... I can see the problem. The parcel was sent to your old address. I do apologise for the inconvenience.
- Oh no. What can you do?
- I'll send a new machine to your correct address today, with express delivery at no extra cost. You should receive it tomorrow. I'll also give you a voucher for ten pounds for your next order.
- That's great, thank you very much.
- You're welcome. Is there anything else I can do for you?
- No, that's all. Have a nice day!`,
`customer service=service client; speaking=à l'appareil; how can i help you=comment puis-je vous aider; ordered=ai commandé; coffee machine=machine à café; website=site web; ago=il y a; still=toujours; arrived=arrivée; i'm sorry to hear that=je suis désolée de l'apprendre; order number=numéro de commande; let me check=laissez-moi vérifier; parcel=colis; sent=envoyé; old address=ancienne adresse; i do apologise=je vous prie de m'excuser; inconvenience=désagrément; correct=bonne / correcte; express delivery=livraison express; at no extra cost=sans frais supplémentaires; receive=recevoir; voucher=bon d'achat; pounds=livres (sterling); next order=prochaine commande; you're welcome=je vous en prie; anything else=autre chose; that's all=c'est tout`,
`What did the customer order?|A coffee machine|A phone|A kettle
Why hasn't the order arrived?|It was sent to the old address|It is out of stock|The customer gave the wrong number
What does Emma offer in addition?|A ten-pound voucher|A full refund|A free coffee machine`)
];
// Les bonnes réponses sont toujours en premier dans les données ; l'appli mélange les choix.
