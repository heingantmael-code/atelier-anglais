// ====== CONTENU PÉDAGOGIQUE ======
// Types d'exercices :
// mcq {q,o,a,x}  gap {s,v,a,x}  tr {fr,a,d,x}  spot {s,f,x}  ls {en}  sp {en,fr}
const IRREG = [
["be","was/were","been","être"],["become","became","become","devenir"],["begin","began","begun","commencer"],["break","broke","broken","casser"],["bring","brought","brought","apporter"],["build","built","built","construire"],["buy","bought","bought","acheter"],["catch","caught","caught","attraper"],["choose","chose","chosen","choisir"],["come","came","come","venir"],["cost","cost","cost","coûter"],["do","did","done","faire"],["drink","drank","drunk","boire"],["drive","drove","driven","conduire"],["eat","ate","eaten","manger"],["fall","fell","fallen","tomber"],["feel","felt","felt","ressentir"],["find","found","found","trouver"],["fly","flew","flown","voler (avion)"],["forget","forgot","forgotten","oublier"],["get","got","got","obtenir"],["give","gave","given","donner"],["go","went","gone","aller"],["grow","grew","grown","grandir"],["have","had","had","avoir"],["hear","heard","heard","entendre"],["keep","kept","kept","garder"],["know","knew","known","savoir"],["leave","left","left","partir, laisser"],["lend","lent","lent","prêter"],["lose","lost","lost","perdre"],["make","made","made","fabriquer"],["meet","met","met","rencontrer"],["pay","paid","paid","payer"],["put","put","put","mettre"],["read","read","read","lire"],["ride","rode","ridden","monter (vélo)"],["run","ran","run","courir"],["say","said","said","dire"],["see","saw","seen","voir"],["sell","sold","sold","vendre"],["send","sent","sent","envoyer"],["sing","sang","sung","chanter"],["sit","sat","sat","s'asseoir"],["sleep","slept","slept","dormir"],["speak","spoke","spoken","parler"],["spend","spent","spent","dépenser, passer (temps)"],["stand","stood","stood","être debout"],["swim","swam","swum","nager"],["take","took","taken","prendre"],["teach","taught","taught","enseigner"],["tell","told","told","raconter, dire"],["think","thought","thought","penser"],["throw","threw","thrown","lancer"],["understand","understood","understood","comprendre"],["wake","woke","woken","se réveiller"],["wear","wore","worn","porter (vêtement)"],["win","won","won","gagner"],["write","wrote","written","écrire"]
];

const UNITS = [
{id:"u1",lvl:"A1",title:"Présent simple et be",focus:"to be, présent simple, 3e personne, négation avec do/does",items:[
{t:"gap",s:"My brother ___ in a bank.",v:"work",a:["works"],x:"He / she / it → -s au présent simple."},
{t:"gap",s:"They ___ from Canada.",v:"be",a:["are","'re"],x:"They are. Be se conjugue : I am, you/we/they are, he/she/it is."},
{t:"mcq",q:"« Elle ne mange pas de viande. »",o:["She doesn't eat meat.","She don't eat meat.","She doesn't eats meat."],a:0,x:"Négation à la 3e personne : doesn't + base verbale."},
{t:"tr",fr:"Je travaille de chez moi le lundi.",a:["I work from home on Mondays.","I work from home on Monday."],d:["at","in","works"],x:"Jour de la semaine : on Monday(s). « De chez moi » = from home."},
{t:"spot",s:"She *have* two cats.",f:"has",x:"Have devient has avec he / she / it."},
{t:"ls",en:"What do you do for a living?"},
{t:"gap",s:"___ your parents live near you?",v:"",a:["Do"],x:"Question au présent : Do + sujet pluriel + base verbale."},
{t:"tr",fr:"Il ne parle pas allemand.",a:["He doesn't speak German.","He does not speak German."],d:["don't","speaks"],x:"Doesn't + base verbale."},
{t:"mcq",q:"Quelle phrase est correcte ?",o:["I'm 28 years old.","I have 28 years.","I am 28 years."],a:0,x:"L'âge se dit avec be : I'm 28 (years old)."},
{t:"sp",en:"I live in Lyon and I work in marketing.",fr:"J'habite à Lyon et je travaille dans le marketing."}
]},
{id:"u2",lvl:"A2",title:"Présent simple ou continu",focus:"habitudes (simple) vs action en cours (be + -ing), verbes d'état",items:[
{t:"gap",s:"Listen! The baby ___.",v:"cry",a:["is crying","'s crying"],x:"Action en cours au moment où on parle : be + -ing."},
{t:"gap",s:"I usually ___ the bus to work.",v:"take",a:["take"],x:"Habitude (usually) : présent simple."},
{t:"mcq",q:"« Je comprends maintenant. »",o:["I understand now.","I'm understanding now."],a:0,x:"Understand, know, want, like, believe sont des verbes d'état : pas de forme en -ing."},
{t:"tr",fr:"Qu'est-ce que tu fais en ce moment ?",a:["What are you doing at the moment?","What are you doing right now?","What are you doing now?"],d:["do","does"],x:"Action en cours : be + -ing."},
{t:"spot",s:"I *am wanting* a coffee.",f:"want",x:"Want est un verbe d'état : pas de -ing."},
{t:"ls",en:"She's working from home this week."},
{t:"gap",s:"Water ___ at 100 degrees.",v:"boil",a:["boils"],x:"Vérité générale : présent simple."},
{t:"mcq",q:"« Il pleut beaucoup en Bretagne. » (en général)",o:["It rains a lot in Brittany.","It's raining a lot in Brittany."],a:0,x:"Fait général → présent simple."},
{t:"tr",fr:"Je suis en train d'apprendre l'anglais.",a:["I'm learning English.","I am learning English."],d:["learn","the"],x:"Les langues : pas d'article. Action en cours : am learning."},
{t:"sp",en:"I'm looking for a new job at the moment.",fr:"Je cherche un nouveau travail en ce moment."}
]},
{id:"u3",lvl:"A2",title:"Le prétérit",focus:"prétérit régulier (-ed) et irrégulier, did / didn't",items:[
{t:"gap",s:"Yesterday I ___ my keys at the office.",v:"leave",a:["left"],x:"Leave – left – left."},
{t:"gap",s:"We ___ a great film last night.",v:"see",a:["saw"],x:"See – saw – seen."},
{t:"mcq",q:"« Tu as vu Paul hier ? »",o:["Did you see Paul yesterday?","Have you seen Paul yesterday?","Did you saw Paul yesterday?"],a:0,x:"Yesterday = moment terminé → prétérit. Après did : base verbale."},
{t:"tr",fr:"Je ne suis pas allé au travail lundi.",a:["I didn't go to work on Monday.","I did not go to work on Monday."],d:["went","at"],x:"Didn't + base : didn't go."},
{t:"spot",s:"She *buyed* a new phone.",f:"bought",x:"Buy est irrégulier : buy – bought – bought."},
{t:"ls",en:"We stayed at a small hotel near the beach."},
{t:"gap",s:"How much ___ it cost?",v:"",a:["did"],x:"Question au passé : did + sujet + base."},
{t:"tr",fr:"Il y a deux ans, j'ai déménagé à Bordeaux.",a:["Two years ago, I moved to Bordeaux.","I moved to Bordeaux two years ago."],d:["since","have"],x:"Il y a = ago, avec le prétérit."},
{t:"mcq",q:"Prétérit de « think » ?",o:["thought","thinked","taught"],a:0,x:"Think – thought – thought. Taught vient de teach."},
{t:"sp",en:"I spent the weekend with my family.",fr:"J'ai passé le week-end avec ma famille."}
]},
{id:"irr",lvl:"A2",title:"Verbes irréguliers",focus:"les 60 verbes irréguliers les plus utiles",gen:"irreg",items:[]},
{id:"u4",lvl:"B1",title:"Present perfect",focus:"present perfect vs prétérit, since / for, ever / never / already / yet",items:[
{t:"gap",s:"I ___ here since 2019.",v:"live",a:["have lived","'ve lived","have been living","'ve been living"],x:"Depuis + action qui continue → present perfect."},
{t:"mcq",q:"« Je la connais depuis 10 ans. »",o:["I've known her for 10 years.","I know her since 10 years.","I've known her since 10 years."],a:0,x:"Present perfect + for (durée)."},
{t:"tr",fr:"Tu es déjà allé à Londres ?",a:["Have you ever been to London?","Have you been to London?"],d:["Did","gone","in"],x:"Expérience de vie : present perfect + ever. Been to = être allé (et revenu)."},
{t:"spot",s:"I *have finished* the report last night.",f:"finished",x:"Last night = moment terminé → prétérit."},
{t:"gap",s:"She hasn't called me ___.",v:"",a:["yet"],x:"Yet en fin de phrase négative ou interrogative = encore / déjà."},
{t:"ls",en:"I've never been to the United States."},
{t:"mcq",q:"Choisis : « We ___ each other for ages. »",o:["have known","know","knew"],a:0,x:"For ages + situation qui dure → present perfect."},
{t:"tr",fr:"Depuis combien de temps apprends-tu l'anglais ?",a:["How long have you been learning English?","How long have you learned English?","How long have you learnt English?"],d:["since","are"],x:"Depuis combien de temps = How long + present perfect (continu)."},
{t:"gap",s:"I've ___ finished my homework, so I can go out.",v:"",a:["already"],x:"Already = déjà, entre have et le participe."},
{t:"sp",en:"I've been working here for three years.",fr:"Je travaille ici depuis trois ans."}
]},
{id:"u5",lvl:"B1",title:"Parler du futur",focus:"will, be going to, présent continu pour les rendez-vous",items:[
{t:"mcq",q:"Le téléphone sonne. « J'y vais ! »",o:["I'll get it!","I'm going to get it!","I get it!"],a:0,x:"Décision prise sur le moment : will."},
{t:"gap",s:"Look at those clouds. It ___ rain.",v:"",a:["is going to","'s going to"],x:"Prédiction basée sur un signe visible : be going to."},
{t:"tr",fr:"Je vois le médecin demain matin.",a:["I'm seeing the doctor tomorrow morning.","I am seeing the doctor tomorrow morning."],d:["will","see"],x:"Rendez-vous fixé : présent continu."},
{t:"spot",s:"I'll call you when I *will arrive*.",f:"arrive",x:"Après when / as soon as au sens futur : présent simple."},
{t:"ls",en:"We're going to move to a bigger flat next year."},
{t:"gap",s:"Don't worry, I ___ tell anyone.",v:"",a:["won't","will not"],x:"Promesse négative : won't."},
{t:"tr",fr:"Qu'est-ce que tu vas faire ce week-end ?",a:["What are you going to do this weekend?","What are you doing this weekend?"],d:["will","make"],x:"Projet : be going to, ou présent continu."},
{t:"mcq",q:"« Je pense qu'il va gagner. »",o:["I think he'll win.","I think he wins.","I think he winning."],a:0,x:"Opinion sur le futur : I think + will."},
{t:"sp",en:"I'll let you know as soon as I hear from them.",fr:"Je te tiens au courant dès que j'ai de leurs nouvelles."}
]},
{id:"u6",lvl:"A2",title:"Poser des questions",focus:"auxiliaires do / does / did, mots interrogatifs, questions indirectes",items:[
{t:"gap",s:"Where ___ she work?",v:"",a:["does"],x:"She → does."},
{t:"tr",fr:"À quelle heure commence le film ?",a:["What time does the film start?","What time does the movie start?"],d:["starts","do"],x:"What time + does + sujet + base."},
{t:"spot",s:"Where *you live*?",f:"do you live",x:"Il faut l'auxiliaire : Where do you live?"},
{t:"mcq",q:"« Peux-tu me dire où est la gare ? »",o:["Can you tell me where the station is?","Can you tell me where is the station?"],a:0,x:"Question indirecte : sujet + verbe, ordre normal."},
{t:"ls",en:"How long does it take to get there?"},
{t:"gap",s:"Who ___ you this book?",v:"give",a:["gave"],x:"Quand who est sujet, pas d'auxiliaire : Who gave you…?"},
{t:"tr",fr:"Combien ça coûte ?",a:["How much does it cost?","How much is it?"],d:["many","costs"],x:"Prix : How much."},
{t:"mcq",q:"« Ça te dérange si j'ouvre la fenêtre ? »",o:["Do you mind if I open the window?","Does it disturb you if I open the window?"],a:0,x:"Formule naturelle : Do you mind if…?"},
{t:"sp",en:"Could you tell me how to get to the city centre?",fr:"Pourriez-vous me dire comment aller au centre-ville ?"}
]},
{id:"u7",lvl:"B1",title:"Les modaux",focus:"can, could, must, have to, should, might",items:[
{t:"mcq",q:"« Tu devrais te reposer. » (conseil)",o:["You should rest.","You must to rest.","You should to rest."],a:0,x:"Should + base verbale pour un conseil."},
{t:"gap",s:"You ___ smoke here. It's forbidden.",v:"",a:["mustn't","must not","can't","cannot"],x:"Interdiction : mustn't / can't."},
{t:"gap",s:"You don't ___ to come if you're busy.",v:"",a:["have"],x:"Don't have to = pas obligé (≠ mustn't = interdit)."},
{t:"spot",s:"She *can speaks* three languages.",f:"can speak",x:"Après un modal : base verbale."},
{t:"tr",fr:"Il pourrait pleuvoir cet après-midi.",a:["It might rain this afternoon.","It could rain this afternoon.","It may rain this afternoon."],d:["can","rains"],x:"Possibilité : might / could / may."},
{t:"ls",en:"Could you speak a bit more slowly, please?"},
{t:"mcq",q:"« Quand j'étais petit, je savais nager. »",o:["When I was young, I could swim.","When I was young, I can swim."],a:0,x:"Capacité au passé : could."},
{t:"tr",fr:"Je dois partir à 18 heures.",a:["I have to leave at 6 pm.","I have to leave at 6.","I must leave at 6 pm.","I have to leave at six."],d:["must to","at the"],x:"Obligation : have to (ou must)."},
{t:"sp",en:"You don't have to decide right now.",fr:"Tu n'es pas obligé de décider tout de suite."}
]},
{id:"u8",lvl:"A2",title:"Comparer et quantifier",focus:"comparatif, superlatif, much / many, a few / a little",items:[
{t:"gap",s:"This flat is ___ than the last one.",v:"big",a:["bigger"],x:"Adjectif court : -er (et doublement de la consonne : big → bigger)."},
{t:"gap",s:"It's the ___ restaurant in town.",v:"good",a:["best"],x:"Good → better → the best."},
{t:"mcq",q:"« Il n'y a pas beaucoup de temps. »",o:["There isn't much time.","There isn't many time.","There aren't much time."],a:0,x:"Time est indénombrable → much."},
{t:"spot",s:"London is *more expensive that* Paris.",f:"more expensive than",x:"Comparaison : than."},
{t:"tr",fr:"J'ai quelques amis à Londres.",a:["I have a few friends in London.","I've got a few friends in London.","I have some friends in London."],d:["little","a little"],x:"A few + dénombrable pluriel."},
{t:"ls",en:"It's much cheaper to go by train."},
{t:"mcq",q:"« C'est le film le plus intéressant de l'année. »",o:["It's the most interesting film of the year.","It's the more interesting film of the year.","It's the most interesting film in the year."],a:0,x:"Superlatif long : the most + adjectif. « De l'année » = of the year."},
{t:"gap",s:"Could I have a ___ more milk, please?",v:"",a:["little","bit"],x:"A little + indénombrable (milk)."},
{t:"sp",en:"The weather is getting better and better.",fr:"Le temps s'améliore de plus en plus."}
]},
{id:"u9",lvl:"B1",title:"Les conditionnels",focus:"if + présent / will, if + prétérit / would, if + past perfect / would have",items:[
{t:"gap",s:"If you ___ hungry, there's some pizza in the fridge.",v:"be",a:["are","'re"],x:"Condition réelle : présent après if."},
{t:"gap",s:"If I ___ rich, I would travel the world.",v:"be",a:["were","was"],x:"Hypothèse : if + prétérit. Were est plus soutenu, was courant à l'oral."},
{t:"mcq",q:"« Si j'avais su, je serais venu. »",o:["If I had known, I would have come.","If I would have known, I would come.","If I knew, I would have come."],a:0,x:"Regret sur le passé : if + past perfect, would have + participe."},
{t:"spot",s:"If I *would have* a car, I'd drive to work.",f:"had",x:"Jamais would dans la partie en if."},
{t:"tr",fr:"À ta place, j'accepterais.",a:["If I were you, I would accept.","If I were you, I'd accept.","If I was you, I'd accept."],d:["will","am"],x:"Conseil : If I were you, I'd…"},
{t:"ls",en:"If it doesn't rain tomorrow, we'll go hiking."},
{t:"gap",s:"What ___ you do if you lost your job?",v:"",a:["would"],x:"Hypothèse : would."},
{t:"tr",fr:"S'il pleut, je resterai à la maison.",a:["If it rains, I'll stay at home.","If it rains, I will stay at home.","If it rains, I'll stay home.","If it rains, I will stay home."],d:["will rain","in"],x:"If + présent, will + base."},
{t:"sp",en:"If I had more time, I would learn to play the guitar.",fr:"Si j'avais plus de temps, j'apprendrais la guitare."}
]},
{id:"u10",lvl:"B1",title:"Prépositions",focus:"in / on / at (temps, lieu), prépositions après verbes et adjectifs",items:[
{t:"gap",s:"The meeting is on Monday ___ 10 o'clock.",v:"",a:["at"],x:"On + jour, at + heure précise."},
{t:"mcq",q:"« Je suis né en 1990. »",o:["I was born in 1990.","I was born on 1990.","I am born in 1990."],a:0,x:"In + année. Naître = to be born, au passé : was born."},
{t:"gap",s:"I'm really good ___ cooking.",v:"",a:["at"],x:"Good at + -ing."},
{t:"spot",s:"I'm *at* the train, I'll be there soon.",f:"on",x:"Transports collectifs : on the train, on the bus, on a plane."},
{t:"tr",fr:"Ça dépend de toi.",a:["It depends on you.","That depends on you."],d:["of","from"],x:"Depend on."},
{t:"ls",en:"I'll meet you at the station at half past six."},
{t:"gap",s:"She's married ___ a doctor.",v:"",a:["to"],x:"Married to (et non with)."},
{t:"mcq",q:"« Je suis à la maison. »",o:["I'm at home.","I'm at the home.","I'm in home."],a:0,x:"At home, sans article."},
{t:"sp",en:"I'm not very good at remembering names.",fr:"Je ne suis pas très doué pour retenir les prénoms."}
]},
{id:"u11",lvl:"B1",title:"Faux amis",focus:"actually, eventually, library, sensible, attend, control, deception",items:[
{t:"mcq",q:"« Actuellement, je travaille à Lille. »",o:["Currently, I work in Lille.","Actually, I work in Lille."],a:0,x:"Actuellement = currently. Actually = en fait."},
{t:"mcq",q:"« Il a fini par accepter. »",o:["He eventually accepted.","He possibly accepted.","He finally accepts."],a:0,x:"Eventually = finalement."},
{t:"spot",s:"I need to *rest* the password.",f:"reset",x:"Rester = to stay. Rest = se reposer. Reset = réinitialiser."},
{t:"mcq",q:"« Une librairie »",o:["a bookshop","a library","a bookstand"],a:0,x:"Library = bibliothèque. Librairie = bookshop (UK) / bookstore (US)."},
{t:"tr",fr:"J'ai assisté à la conférence.",a:["I attended the conference.","I went to the conference."],d:["assisted","at"],x:"Assister à = attend. Assist = aider."},
{t:"mcq",q:"« Quelle déception ! »",o:["What a disappointment!","What a deception!"],a:0,x:"Deception = tromperie. Déception = disappointment."},
{t:"spot",s:"She's very *sympathetic*, everybody likes her.",f:"nice",x:"Sympathique = nice, friendly. Sympathetic = compatissant."},
{t:"ls",en:"Actually, I've changed my mind."},
{t:"mcq",q:"« Le contrôle des billets »",o:["the ticket inspection","the ticket control"],a:0,x:"Control = maîtriser, diriger. Contrôle (vérification) = check, inspection."},
{t:"sp",en:"I eventually found a job that I really enjoy.",fr:"J'ai fini par trouver un travail qui me plaît vraiment."}
]},
{id:"u12",lvl:"B2",title:"Phrasal verbs essentiels",focus:"get up, find out, give up, look forward to, run out of, put off, turn down",items:[
{t:"mcq",q:"« J'ai arrêté de fumer. »",o:["I gave up smoking.","I gave out smoking.","I stopped to smoke."],a:0,x:"Give up + -ing = arrêter, abandonner. Stop to smoke = s'arrêter pour fumer."},
{t:"gap",s:"We've run ___ of milk.",v:"",a:["out"],x:"Run out of = ne plus avoir de."},
{t:"gap",s:"I'm looking forward ___ seeing you.",v:"",a:["to"],x:"Look forward to + -ing."},
{t:"tr",fr:"Je l'ai découvert hier.",a:["I found out yesterday.","I found out about it yesterday."],d:["discovered","founded"],x:"Find out = découvrir (une information)."},
{t:"mcq",q:"« Ils ont refusé mon offre. »",o:["They turned down my offer.","They turned off my offer.","They put down my offer."],a:0,x:"Turn down = refuser."},
{t:"ls",en:"Don't put off until tomorrow what you can do today."},
{t:"gap",s:"Can you pick me ___ at the station?",v:"",a:["up"],x:"Pick up = passer prendre."},
{t:"spot",s:"I get on well with my colleagues.",x:"Phrase correcte : get on (well) with = bien s'entendre avec."},
{t:"mcq",q:"« Il faut que je rattrape mon retard. »",o:["I need to catch up.","I need to catch on.","I need to come up."],a:0,x:"Catch up = rattraper (son retard)."},
{t:"sp",en:"I'm really looking forward to working with you.",fr:"J'ai vraiment hâte de travailler avec vous."}
]}
];

const SHADOW = [
["Se présenter",[["Nice to meet you. I've heard a lot about you.","Ravi de te rencontrer. J'ai beaucoup entendu parler de toi."],["I'm originally from Brittany, but I live in Paris now.","Je viens de Bretagne, mais j'habite à Paris maintenant."],["What do you do for a living?","Qu'est-ce que tu fais dans la vie ?"],["I've been working in sales for about five years.","Je travaille dans la vente depuis environ cinq ans."],["In my free time, I like running and cooking.","Pendant mon temps libre, j'aime courir et cuisiner."]]],
["Au travail",[["Could we schedule a call for next week?","Pourrait-on prévoir un appel la semaine prochaine ?"],["I'll get back to you by the end of the day.","Je reviens vers vous d'ici la fin de la journée."],["Sorry, could you repeat that? The connection is bad.","Pardon, pouvez-vous répéter ? La connexion est mauvaise."],["Let me share my screen.","Je partage mon écran."],["I'm afraid I can't make it on Thursday.","J'ai peur de ne pas pouvoir être là jeudi."]]],
["En voyage",[["I'd like to check in, please. I have a reservation.","Je voudrais m'enregistrer, s'il vous plaît. J'ai une réservation."],["Excuse me, how do I get to the nearest metro station?","Excusez-moi, comment aller à la station de métro la plus proche ?"],["Is breakfast included in the price?","Le petit-déjeuner est-il compris dans le prix ?"],["My flight has been cancelled. What are my options?","Mon vol a été annulé. Quelles sont mes options ?"],["Could you recommend a good place to eat around here?","Pourriez-vous me recommander un bon endroit pour manger par ici ?"]]],
["Au restaurant",[["Could we have a table for two, please?","Pourrait-on avoir une table pour deux, s'il vous plaît ?"],["I'll have the chicken, and could I get a glass of water?","Je vais prendre le poulet, et pourrais-je avoir un verre d'eau ?"],["Does this dish contain nuts? I'm allergic.","Ce plat contient-il des noix ? Je suis allergique."],["Could we have the bill, please?","Pourrait-on avoir l'addition, s'il vous plaît ?"]]],
["Commerce",[["Thank you for taking the time to meet with me.","Merci d'avoir pris le temps de me rencontrer."],["Could you send me a quote by Friday?","Pourriez-vous m'envoyer un devis d'ici vendredi ?"],["We can offer you a ten per cent discount on large orders.","Nous pouvons vous proposer une remise de dix pour cent sur les grosses commandes."],["I'm afraid that's above our budget.","Je crains que ce soit au-dessus de notre budget."],["When can you deliver?","Quand pouvez-vous livrer ?"],["Let me check with my manager and get back to you.","Je vérifie avec mon responsable et je reviens vers vous."],["Sales increased by twelve per cent this quarter.","Les ventes ont augmenté de douze pour cent ce trimestre."],["We apologise for the delay and we'll fix it today.","Nous nous excusons pour le retard et nous allons régler ça aujourd'hui."],["Could we meet halfway on the price?","Pourrait-on faire un pas chacun sur le prix ?"],["I look forward to working with you.","J'ai hâte de travailler avec vous."]]],
["Donner son avis",[["To be honest, I'm not sure that's a good idea.","Pour être honnête, je ne suis pas sûr que ce soit une bonne idée."],["I see your point, but I think we should wait.","Je comprends ton point de vue, mais je pense qu'on devrait attendre."],["It depends on how much time we have.","Ça dépend du temps dont on dispose."],["I couldn't agree more.","Je suis tout à fait d'accord."],["That's a fair point. I hadn't thought of that.","C'est juste. Je n'y avais pas pensé."]]]
];

const SCENARIOS = [
{id:"cold",part:"business",title:"Appel de prospection",brief:"You are the purchasing manager of a mid-sized company. The learner is a salesperson calling you to sell their product or service. Be polite but busy and a bit sceptical; ask about price, delivery and why you should change supplier."},
{id:"nego",part:"business",title:"Négocier avec un fournisseur",brief:"You are a supplier. The learner is a buyer who wants a better price for a large order. Defend your margins, ask for commitments (volume, payment terms) in exchange for any discount, and try to reach a deal."},
{id:"angry",part:"business",title:"Client mécontent",brief:"You are an unhappy customer whose order arrived late and damaged. The learner works in customer service and must calm you down and find a solution. Start a bit annoyed and become reasonable if they handle it well."},
{id:"pres",part:"business",title:"Présenter des résultats",brief:"You are the learner's manager in a meeting. Ask them to present last quarter's sales figures, then ask follow-up questions about trends, problems and next steps."},
{id:"fair",part:"business",title:"Small talk sur un salon professionnel",brief:"You are a potential business partner the learner meets at a trade fair. Make small talk, ask about their company and products, and exchange ideas about working together."},
{id:"small",part:"daily",title:"Small talk avec un collègue",brief:"You are Sam, a friendly British colleague chatting with the learner at the coffee machine on a Monday morning."},
{id:"resto",part:"daily",title:"Commander au restaurant",brief:"You are a waiter in a busy London restaurant. Take the learner's order, suggest dishes, handle questions about allergies and the bill."},
{id:"job",part:"business",title:"Entretien d'embauche",brief:"You are a hiring manager interviewing the learner for a job in their field. Ask classic interview questions one at a time (experience, strengths, a difficult situation, why this job)."},
{id:"hotel",part:"daily",title:"Problème à l'hôtel",brief:"You are a hotel receptionist. The learner has a problem with their room. Be polite, ask for details and offer solutions."},
{id:"way",part:"daily",title:"Demander son chemin",brief:"You are a local in Manchester. The learner is lost and asks for directions. Give realistic directions and check they understood."},
{id:"series",part:"daily",title:"Parler d'une série ou d'un film",brief:"You are a friend who loves films and TV series. Ask the learner what they watched recently and discuss it with opinions."},
{id:"support",part:"daily",title:"Appeler le service client",brief:"You are a customer service agent for an internet provider. The learner calls because their connection keeps dropping. Ask for details and troubleshoot."},
{id:"debate",part:"daily",title:"Débattre d'un sujet",brief:"You are a curious friend who likes friendly debates. Pick a light topic (remote work, social media, cities vs countryside) and ask the learner's opinion, then gently challenge it."}
];
