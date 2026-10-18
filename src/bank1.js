// ====== BANQUE DE PHRASES (anglais || français), par partie et par niveau ======
const BANK = [];
function BK(part, lvl, txt) {
  txt.trim().split("\n").forEach(l => { const i = l.indexOf(" || "); if (i > 0) { const en = l.slice(0, i).trim(), fr = l.slice(i + 4).trim(); BANK.push({part, lvl, en, fr}); FR_TR[en.replace(/\s+([.,!?;:])/g, "$1")] = fr; } });
}
BK("daily", "A1", `
Good morning! How are you today? || Bonjour ! Comment vas-tu aujourd'hui ?
I'm tired, but I'm happy. || Je suis fatigué, mais je suis content.
My phone is on the table. || Mon téléphone est sur la table.
Where is the bathroom, please? || Où sont les toilettes, s'il vous plaît ?
I have two brothers and one sister. || J'ai deux frères et une sœur.
We live in a small flat near the station. || Nous habitons dans un petit appartement près de la gare.
Can I have a glass of water, please? || Je peux avoir un verre d'eau, s'il vous plaît ?
The supermarket closes at eight. || Le supermarché ferme à huit heures.
It's cold today, take a jacket. || Il fait froid aujourd'hui, prends une veste.
I don't eat meat. || Je ne mange pas de viande.
What time is it? || Quelle heure est-il ?
My birthday is in April. || Mon anniversaire est en avril.
I usually get up at seven. || D'habitude, je me lève à sept heures.
She works in a hospital. || Elle travaille dans un hôpital.
Is this seat free? || Cette place est libre ?
I like this song very much. || J'aime beaucoup cette chanson.
How much are these apples? || Combien coûtent ces pommes ?
I'm sorry, I don't understand. || Désolé, je ne comprends pas.
Can you speak more slowly, please? || Vous pouvez parler plus lentement, s'il vous plaît ?
My car is red and very old. || Ma voiture est rouge et très vieille.
We have dinner at half past seven. || Nous dînons à sept heures et demie.
The children are in the garden. || Les enfants sont dans le jardin.
Do you have a pen? || Tu as un stylo ?
I go to work by bus. || Je vais au travail en bus.
This coffee is too hot. || Ce café est trop chaud.
Open the window, please. || Ouvre la fenêtre, s'il te plaît.
My sister has a new job. || Ma sœur a un nouveau travail.
I need a new pair of shoes. || J'ai besoin d'une nouvelle paire de chaussures.
The bank is next to the post office. || La banque est à côté de la poste.
We don't have any bread. || Nous n'avons plus de pain.
Are you French or Belgian? || Tu es français ou belge ?
I'm hungry. Let's eat something. || J'ai faim. Mangeons quelque chose.
He watches football every Saturday. || Il regarde le football tous les samedis.
The keys are in my bag. || Les clés sont dans mon sac.
Turn left at the traffic lights. || Tourne à gauche aux feux.
My favourite colour is blue. || Ma couleur préférée est le bleu.
I can't find my glasses. || Je ne trouve pas mes lunettes.
See you next week! || À la semaine prochaine !
`);
BK("daily", "A2", `
I was at home all day yesterday. || J'étais à la maison toute la journée hier.
We went to the beach last weekend. || Nous sommes allés à la plage le week-end dernier.
Could you help me carry these bags? || Tu pourrais m'aider à porter ces sacs ?
I'm going to cook pasta tonight. || Je vais faire des pâtes ce soir.
She has never been to London. || Elle n'est jamais allée à Londres.
The film starts in ten minutes, hurry up! || Le film commence dans dix minutes, dépêche-toi !
I'd like to book a table for four. || Je voudrais réserver une table pour quatre.
How long does it take to get to the airport? || Combien de temps faut-il pour aller à l'aéroport ?
My neighbour's dog barks all night. || Le chien de mon voisin aboie toute la nuit.
I think it's going to rain this afternoon. || Je pense qu'il va pleuvoir cet après-midi.
We usually do the shopping on Saturday morning. || Nous faisons généralement les courses le samedi matin.
Did you sleep well? || Tu as bien dormi ?
I lost my wallet on the bus. || J'ai perdu mon portefeuille dans le bus.
This shirt is too small. Do you have a bigger size? || Cette chemise est trop petite. Vous avez une taille au-dessus ?
My brother is taller than me, but younger. || Mon frère est plus grand que moi, mais plus jeune.
It's the best pizza I've ever eaten. || C'est la meilleure pizza que j'aie jamais mangée.
I have to go to the dentist tomorrow. || Je dois aller chez le dentiste demain.
We were watching TV when the lights went out. || Nous regardions la télé quand la lumière s'est éteinte.
Can you recommend a good restaurant around here? || Vous pouvez me conseiller un bon restaurant par ici ?
I've been learning English for three months. || J'apprends l'anglais depuis trois mois.
Don't forget to switch off the lights. || N'oublie pas d'éteindre les lumières.
The train was cancelled because of the snow. || Le train a été annulé à cause de la neige.
I don't feel very well, I think I've got a cold. || Je ne me sens pas très bien, je crois que j'ai un rhume.
Would you like to come for dinner on Friday? || Tu veux venir dîner vendredi ?
How often do you go to the gym? || Tu vas à la salle de sport tous les combien ?
There's a lot of traffic in the city centre. || Il y a beaucoup de circulation dans le centre-ville.
My flat is small, but it's very comfortable. || Mon appartement est petit, mais il est très confortable.
I forgot my umbrella and got wet. || J'ai oublié mon parapluie et je me suis fait mouiller.
She's looking for a job in a hotel. || Elle cherche un travail dans un hôtel.
We need to buy a present for Mum. || Nous devons acheter un cadeau pour maman.
The museum is closed on Mondays. || Le musée est fermé le lundi.
Could you take a photo of us, please? || Vous pourriez nous prendre en photo, s'il vous plaît ?
I usually walk to work when the weather is nice. || Je vais généralement au travail à pied quand il fait beau.
What did you do last night? || Qu'est-ce que tu as fait hier soir ?
I'm not sure, let me check my diary. || Je ne suis pas sûr, je vérifie mon agenda.
The doctor told me to stay in bed. || Le médecin m'a dit de rester au lit.
It takes me twenty minutes to get to work. || Il me faut vingt minutes pour aller au travail.
Excuse me, is this the right bus for the station? || Excusez-moi, c'est bien le bon bus pour la gare ?
My parents are coming to visit next month. || Mes parents viennent nous voir le mois prochain.
I'll call you back in five minutes. || Je te rappelle dans cinq minutes.
`);
BK("daily", "B1", `
I've been living in this neighbourhood for about six years. || J'habite dans ce quartier depuis environ six ans.
If I had more free time, I'd learn to play the piano. || Si j'avais plus de temps libre, j'apprendrais à jouer du piano.
I'm thinking of moving to a bigger flat next year. || Je pense déménager dans un appartement plus grand l'année prochaine.
The landlord still hasn't fixed the heating. || Le propriétaire n'a toujours pas réparé le chauffage.
We got lost on the way, so we arrived an hour late. || Nous nous sommes perdus en route, donc nous sommes arrivés avec une heure de retard.
Could you tell me where the nearest pharmacy is? || Pourriez-vous me dire où se trouve la pharmacie la plus proche ?
I used to hate vegetables, but now I love them. || Avant je détestais les légumes, mais maintenant je les adore.
She told me she would be a bit late. || Elle m'a dit qu'elle serait un peu en retard.
I'm really looking forward to the holidays. || J'ai vraiment hâte d'être en vacances.
I'd rather stay in tonight, I'm exhausted. || Je préfère rester à la maison ce soir, je suis épuisé.
It depends on how much it costs. || Ça dépend de combien ça coûte.
I've just realised I left my phone at the restaurant. || Je viens de me rendre compte que j'ai laissé mon téléphone au restaurant.
You should have told me you were coming. || Tu aurais dû me dire que tu venais.
I'm not used to getting up so early. || Je n'ai pas l'habitude de me lever si tôt.
The more I practise, the more confident I feel. || Plus je m'entraîne, plus je me sens à l'aise.
We were about to leave when it started raining. || Nous étions sur le point de partir quand il s'est mis à pleuvoir.
I can't stand people who talk loudly on the phone. || Je ne supporte pas les gens qui parlent fort au téléphone.
Have you ever thought about living abroad? || Tu as déjà pensé à vivre à l'étranger ?
I'll let you know as soon as I get the results. || Je te préviens dès que j'ai les résultats.
My knee has been hurting since I went running. || J'ai mal au genou depuis que je suis allé courir.
It's not worth taking a taxi, it's only ten minutes on foot. || Ça ne vaut pas la peine de prendre un taxi, c'est à dix minutes à pied.
Would you mind if I opened the window? || Ça vous dérangerait si j'ouvrais la fenêtre ?
I've run out of milk, could you get some on your way home? || Je n'ai plus de lait, tu pourrais en prendre en rentrant ?
The flight was delayed, so we missed our connection. || Le vol a été retardé, donc nous avons raté notre correspondance.
I didn't recognise you with your new haircut! || Je ne t'ai pas reconnu avec ta nouvelle coupe !
As far as I know, the shop opens at nine. || À ma connaissance, le magasin ouvre à neuf heures.
I wish I had brought a warmer coat. || J'aurais dû prendre un manteau plus chaud.
He apologised for being so rude yesterday. || Il s'est excusé d'avoir été si impoli hier.
We split the bill between the four of us. || Nous avons partagé l'addition entre nous quatre.
I'm trying to cut down on sugar. || J'essaie de réduire le sucre.
Can you keep an eye on my bag for a minute? || Tu peux surveiller mon sac une minute ?
I'll pick you up at the station at six. || Je viendrai te chercher à la gare à six heures.
It took me ages to find a parking space. || J'ai mis un temps fou à trouver une place de parking.
I'm afraid I can't make it on Saturday. || J'ai peur de ne pas pouvoir venir samedi.
She's the kind of person who always tells the truth. || C'est le genre de personne qui dit toujours la vérité.
We've decided to spend Christmas with my in-laws. || Nous avons décidé de passer Noël chez mes beaux-parents.
If you're not feeling better tomorrow, go and see a doctor. || Si tu ne vas pas mieux demain, va voir un médecin.
I've been meaning to call you for weeks. || Ça fait des semaines que je voulais t'appeler.
The new flat is much brighter than the old one. || Le nouvel appartement est beaucoup plus lumineux que l'ancien.
I had my phone repaired, but the battery still doesn't last. || J'ai fait réparer mon téléphone, mais la batterie ne tient toujours pas.
`);
BK("daily", "B2", `
Had I known about the strike, I would have taken the car. || Si j'avais su pour la grève, j'aurais pris la voiture.
I'm not sure it's worth the hassle, to be honest. || Je ne suis pas sûr que ça vaille la peine, pour être honnête.
She's been working flat out to finish the renovation before winter. || Elle travaille d'arrache-pied pour finir la rénovation avant l'hiver.
It's high time we sorted out the mess in the garage. || Il est grand temps qu'on range le bazar dans le garage.
I can't help thinking we've forgotten something. || Je ne peux pas m'empêcher de penser qu'on a oublié quelque chose.
No matter how hard I try, I can't get used to the noise. || J'ai beau essayer, je n'arrive pas à m'habituer au bruit.
He must have taken the wrong turning, he should be here by now. || Il a dû se tromper de route, il devrait déjà être là.
I'd appreciate it if you didn't mention it to anyone. || J'apprécierais que tu n'en parles à personne.
We ended up staying much longer than we had planned. || Nous avons fini par rester bien plus longtemps que prévu.
The neighbours have been complaining about the noise again. || Les voisins se plaignent encore du bruit.
I'm torn between moving to the countryside and staying in the city. || J'hésite entre partir à la campagne et rester en ville.
By the time we got to the cinema, the film had already started. || Le temps qu'on arrive au cinéma, le film avait déjà commencé.
I'd better get going, otherwise I'll miss the last train. || Je ferais mieux d'y aller, sinon je vais rater le dernier train.
He's not the sort of person you can easily talk round. || Ce n'est pas le genre de personne qu'on convainc facilement.
Whatever happens, don't let them talk you into signing anything. || Quoi qu'il arrive, ne les laisse pas te convaincre de signer quoi que ce soit.
I was supposed to meet her at noon, but something came up. || J'étais censé la retrouver à midi, mais j'ai eu un empêchement.
The doctor advised me to take it easy for a couple of weeks. || Le médecin m'a conseillé de lever le pied pendant deux semaines.
It turned out that the flat had been rented to someone else. || Il s'est avéré que l'appartement avait été loué à quelqu'un d'autre.
I'm not keen on going out tonight; I'd rather have a quiet evening. || Je n'ai pas très envie de sortir ce soir ; je préfère une soirée tranquille.
Not only did they arrive late, but they also forgot the cake. || Non seulement ils sont arrivés en retard, mais en plus ils ont oublié le gâteau.
If it weren't for my sister, I would never have found this job. || Sans ma sœur, je n'aurais jamais trouvé ce travail.
We're having the bathroom redone, so the house is upside down. || Nous faisons refaire la salle de bain, alors la maison est sens dessus dessous.
You'd think they would have warned us about the delay. || On aurait pu croire qu'ils nous préviendraient du retard.
I've got a lot on my plate at the moment, can we talk next week? || J'ai beaucoup de choses à gérer en ce moment, on peut en parler la semaine prochaine ?
She came up with a brilliant idea for the party. || Elle a eu une idée géniale pour la fête.
The more I think about it, the less I like the idea. || Plus j'y pense, moins l'idée me plaît.
I'll believe it when I see it. || Je le croirai quand je le verrai.
He's been under the weather since he came back from holiday. || Il n'est pas dans son assiette depuis qu'il est rentré de vacances.
There's no point in arguing about it now. || Ça ne sert à rien de se disputer à ce sujet maintenant.
I wouldn't have bought it if I'd known it was second-hand. || Je ne l'aurais pas acheté si j'avais su que c'était d'occasion.
`);
BK("daily", "C1", `
Little did I know that this trip would change my life. || J'étais loin de me douter que ce voyage changerait ma vie.
Were it not for the rain, we would have had the barbecue outside. || S'il n'avait pas plu, nous aurions fait le barbecue dehors.
It goes without saying that you're welcome to stay as long as you like. || Il va sans dire que tu peux rester aussi longtemps que tu veux.
I've half a mind to cancel the whole thing. || J'ai bien envie de tout annuler.
She's bound to find out sooner or later. || Elle finira forcément par l'apprendre.
Try as I might, I couldn't get the stain out of the carpet. || J'ai eu beau faire, je n'ai pas réussi à enlever la tache du tapis.
Much as I'd like to help, I simply don't have the time. || J'aimerais beaucoup aider, mais je n'ai tout simplement pas le temps.
On no account should you leave the door unlocked. || Tu ne dois sous aucun prétexte laisser la porte ouverte.
The neighbourhood has changed beyond recognition over the past decade. || Le quartier a changé du tout au tout en dix ans.
I'm none the wiser after reading the instructions. || Je n'en sais pas plus après avoir lu le mode d'emploi.
For all its faults, I still love living in this city. || Malgré tous ses défauts, j'aime toujours vivre dans cette ville.
Should you need anything, don't hesitate to knock on my door. || Si tu as besoin de quoi que ce soit, n'hésite pas à frapper à ma porte.
He's prone to exaggerating, so take what he says with a pinch of salt. || Il a tendance à exagérer, alors prends ce qu'il dit avec des pincettes.
The noise from the building site is driving me up the wall. || Le bruit du chantier me rend fou.
It's not so much the price that bothers me as the quality. || Ce n'est pas tant le prix qui me dérange que la qualité.
`);
