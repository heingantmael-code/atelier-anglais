// ====== TRADUCTIONS DES PHRASES (anglais || français) ======
const FR_TR = {};
function TRL(txt) { txt.trim().split("\n").forEach(l => { const i = l.indexOf(" || "); if (i > 0) FR_TR[l.slice(0, i).trim().replace(/\s+([.,!?;:])/g, "$1")] = l.slice(i + 4).trim(); }); }
TRL(`
My sister lives in London. || Ma sœur habite à Londres.
He watches TV every evening. || Il regarde la télé tous les soirs.
The shop opens at nine. || Le magasin ouvre à neuf heures.
This bag costs fifty euros. || Ce sac coûte cinquante euros.
She studies law at university. || Elle étudie le droit à l'université.
My boss goes to Spain every summer. || Mon patron va en Espagne chaque été.
It rains a lot in November. || Il pleut beaucoup en novembre.
Everybody knows the answer. || Tout le monde connaît la réponse.
He doesn't like coffee. || Il n'aime pas le café.
Does your brother speak Spanish? || Est-ce que ton frère parle espagnol ?
She doesn't know the answer. || Elle ne connaît pas la réponse.
It doesn't matter. || Ce n'est pas grave.
Does she work on Saturdays? || Est-ce qu'elle travaille le samedi ?
My car doesn't start in the morning. || Ma voiture ne démarre pas le matin.
Does he live near here? || Est-ce qu'il habite près d'ici ?
I don't like fish. || Je n'aime pas le poisson.
She doesn't work here anymore. || Elle ne travaille plus ici.
We don't have a car. || Nous n'avons pas de voiture.
They don't understand the question. || Ils ne comprennent pas la question.
I'm not ready yet. || Je ne suis pas encore prêt.
He doesn't speak French. || Il ne parle pas français.
I didn't go to the party. || Je ne suis pas allé à la fête.
Did you see the match? || Tu as vu le match ?
We didn't buy anything. || Nous n'avons rien acheté.
She didn't call me back. || Elle ne m'a pas rappelé.
Did he give you the keys? || Est-ce qu'il t'a donné les clés ?
Did you enjoy the film? || Le film t'a plu ?
They didn't want to leave. || Ils ne voulaient pas partir.
There are a lot of people here. || Il y a beaucoup de monde ici.
There are many problems with this plan. || Ce projet pose beaucoup de problèmes.
There's a pharmacy around the corner. || Il y a une pharmacie au coin de la rue.
There is a problem with my order. || Il y a un problème avec ma commande.
There were three messages for you. || Il y avait trois messages pour toi.
There were fifty people at the meeting. || Il y avait cinquante personnes à la réunion.
I am 25. || J'ai 25 ans.
How old are you? || Quel âge as-tu ?
My daughter is six. || Ma fille a six ans.
She is 40 years old. || Elle a 40 ans.
He's twenty-one years old. || Il a vingt et un ans.
My grandfather is 90. || Mon grand-père a 90 ans.
I am hungry. || J'ai faim.
You are right, it's too expensive. || Tu as raison, c'est trop cher.
Are you cold? I can close the window. || Tu as froid ? Je peux fermer la fenêtre.
She is afraid of spiders. || Elle a peur des araignées.
We are thirsty after the walk. || Nous avons soif après la promenade.
He was wrong about the date. || Il s'est trompé de date.
I am hot, can you open the window? || J'ai chaud, tu peux ouvrir la fenêtre ?
I agree with you. || Je suis d'accord avec toi.
She doesn't agree with the plan. || Elle n'est pas d'accord avec le projet.
I totally agree. || Je suis tout à fait d'accord.
Do you agree? || Tu es d'accord ?
We agree on the price. || Nous sommes d'accord sur le prix.
They don't agree with the decision. || Ils ne sont pas d'accord avec la décision.
I am working right now, can I call you back? || Je suis en train de travailler, je peux te rappeler ?
She is sleeping at the moment. || Elle dort en ce moment.
They're watching a film. || Ils regardent un film.
Look, it is snowing! || Regarde, il neige !
What are you doing? || Qu'est-ce que tu fais ?
We're having lunch. || Nous sommes en train de déjeuner.
I want a coffee. || Je veux un café.
She knows the answer. || Elle connaît la réponse.
I need some help. || J'ai besoin d'aide.
Do you understand me? || Tu me comprends ?
This bag belongs to my sister. || Ce sac appartient à ma sœur.
I don't know what he means. || Je ne sais pas ce qu'il veut dire.
He needs a new computer. || Il a besoin d'un nouvel ordinateur.
She bought a new phone. || Elle a acheté un nouveau téléphone.
I thought it was closed. || Je pensais que c'était fermé.
We went to Italy last year. || Nous sommes allés en Italie l'année dernière.
He caught the last train. || Il a attrapé le dernier train.
She brought a cake. || Elle a apporté un gâteau.
They taught me a lot. || Ils m'ont beaucoup appris.
I took a taxi to the airport. || J'ai pris un taxi pour l'aéroport.
We went home early. || Nous sommes rentrés tôt.
I have gone there twice. || J'y suis allé deux fois.
She has written three emails this morning. || Elle a écrit trois e-mails ce matin.
The window is broken. || La fenêtre est cassée.
Have you eaten yet? || Tu as déjà mangé ?
I've seen this film before. || J'ai déjà vu ce film.
He has taken the wrong bag. || Il a pris le mauvais sac.
They have done a great job. || Ils ont fait du super travail.
We had forgotten the tickets. || Nous avions oublié les billets.
I have lived here since 2018. || J'habite ici depuis 2018.
How long have you been married? || Depuis combien de temps es-tu marié ?
She has been learning English for two years. || Elle apprend l'anglais depuis deux ans.
I have known him since we were kids. || Je le connais depuis que nous sommes enfants.
We have worked together for five years. || Nous travaillons ensemble depuis cinq ans.
He's had this car since 2015. || Il a cette voiture depuis 2015.
How long have you been waiting? || Depuis combien de temps attends-tu ?
I saw him yesterday. || Je l'ai vu hier.
She finished school in 2015. || Elle a terminé ses études en 2015.
We met two years ago. || Nous nous sommes rencontrés il y a deux ans.
Did you go to the cinema last night? || Tu es allé au cinéma hier soir ?
They arrived an hour ago. || Ils sont arrivés il y a une heure.
When did you start working here? || Quand as-tu commencé à travailler ici ?
I lost my keys last week. || J'ai perdu mes clés la semaine dernière.
Have you ever been to Japan? || Tu es déjà allé au Japon ?
It's the best film I have ever seen. || C'est le meilleur film que j'aie jamais vu.
She has just left the office. || Elle vient de quitter le bureau.
So far today, I have written three reports. || Depuis ce matin, j'ai écrit trois rapports.
Have you finished your report yet? || Tu as déjà fini ton rapport ?
How many times have you visited London so far? || Combien de fois es-tu allé à Londres jusqu'à présent ?
I moved here three years ago. || J'ai emménagé ici il y a trois ans.
Two days ago I called him. || Il y a deux jours, je l'ai appelé.
They left an hour ago. || Ils sont partis il y a une heure.
I saw her a week ago. || Je l'ai vue il y a une semaine.
We bought this house ten years ago. || Nous avons acheté cette maison il y a dix ans.
She called five minutes ago. || Elle a appelé il y a cinq minutes.
I've known her for ten years. || Je la connais depuis dix ans.
She has worked here since 2020. || Elle travaille ici depuis 2020.
We've been friends since childhood. || Nous sommes amis depuis l'enfance.
I've been waiting for two hours. || J'attends depuis deux heures.
They have lived in Lyon since last summer. || Ils habitent à Lyon depuis l'été dernier.
He's been ill for a week. || Il est malade depuis une semaine.
It hasn't rained since Monday. || Il n'a pas plu depuis lundi.
I'll call you when I arrive. || Je t'appellerai quand j'arriverai.
Let me know as soon as you know. || Préviens-moi dès que tu sais.
We'll start when everyone is here. || Nous commencerons quand tout le monde sera là.
Wait here until I come back. || Attends ici jusqu'à ce que je revienne.
She'll be happy when she hears the news. || Elle sera contente quand elle apprendra la nouvelle.
Before you leave, close the windows. || Avant de partir, ferme les fenêtres.
The phone is ringing. I'll answer it! || Le téléphone sonne. Je réponds !
Look at those clouds, it is going to rain. || Regarde ces nuages, il va pleuvoir.
I'm going to visit my parents this weekend, I booked the train. || Je vais voir mes parents ce week-end, j'ai réservé le train.
- I'm thirsty. - I'll get you a glass of water. || - J'ai soif. - Je vais te chercher un verre d'eau.
I promise I'll be on time. || Je te promets que je serai à l'heure.
Watch out! You are going to fall! || Attention ! Tu vas tomber !
If it rains, we'll stay home. || S'il pleut, nous resterons à la maison.
I'll call you if I have time. || Je t'appellerai si j'ai le temps.
If you heat ice, it melts. || Si on chauffe de la glace, elle fond.
If you need help, ask me. || Si tu as besoin d'aide, demande-moi.
We'll miss the train if we don't hurry. || Nous allons rater le train si nous ne nous dépêchons pas.
If she comes, I'll be happy. || Si elle vient, je serai content.
If I had more time, I'd travel. || Si j'avais plus de temps, je voyagerais.
If I were you, I'd accept. || À ta place, j'accepterais.
If she knew, she would be angry. || Si elle savait, elle serait en colère.
If we lived in London, we'd see you more often. || Si nous habitions à Londres, nous te verrions plus souvent.
What would you do if you won the lottery? || Que ferais-tu si tu gagnais au loto ?
I would buy a house if I had the money. || J'achèterais une maison si j'avais l'argent.
If I had known, I would have come. || Si j'avais su, je serais venu.
If we had left earlier, we would have caught the train. || Si nous étions partis plus tôt, nous aurions eu le train.
If she had asked me, I would have helped her. || Si elle me l'avait demandé, je l'aurais aidée.
If you had told me, I would have waited. || Si tu me l'avais dit, j'aurais attendu.
I would have called if I had had your number. || J'aurais appelé si j'avais eu ton numéro.
If they had studied, they would have passed. || S'ils avaient révisé, ils auraient réussi.
She can swim. || Elle sait nager.
You should call her. || Tu devrais l'appeler.
He must go now. || Il doit partir maintenant.
We might arrive late. || Nous arriverons peut-être en retard.
Can you help me? || Tu peux m'aider ?
It could rain later. || Il pourrait pleuvoir plus tard.
You should see a doctor. || Tu devrais voir un médecin.
She has to leave early. || Elle doit partir tôt.
Do you have to work on Sunday? || Est-ce que tu dois travailler dimanche ?
You don't have to come if you're busy. || Tu n'es pas obligé de venir si tu es occupé.
You mustn't smoke here, it's forbidden. || Tu ne dois pas fumer ici, c'est interdit.
I had to wait for an hour. || J'ai dû attendre une heure.
He has to wear a suit at work. || Il doit porter un costume au travail.
I used to play tennis when I was young. || Je jouais au tennis quand j'étais jeune.
I'm used to working at night. || J'ai l'habitude de travailler la nuit.
She used to live in Berlin. || Elle habitait à Berlin avant.
Did you use to have long hair? || Tu avais les cheveux longs avant ?
He isn't used to driving on the left. || Il n'a pas l'habitude de conduire à gauche.
We used to go there every summer as kids. || Enfants, nous y allions tous les étés.
I would like to eat something. || J'aimerais manger quelque chose.
She wants to go home. || Elle veut rentrer chez elle.
I'd like a coffee, please. || Je voudrais un café, s'il vous plaît.
We decided to go by train. || Nous avons décidé d'y aller en train.
You don't need to come early. || Tu n'as pas besoin de venir tôt.
I hope to see you soon. || J'espère te voir bientôt.
They plan to visit Rome. || Ils prévoient de visiter Rome.
I want you to come with me. || Je veux que tu viennes avec moi.
She'd like us to call her tomorrow. || Elle aimerait que nous l'appelions demain.
My boss wants me to finish the report today. || Mon patron veut que je termine le rapport aujourd'hui.
They asked me to wait. || Ils m'ont demandé d'attendre.
I don't want you to worry. || Je ne veux pas que tu t'inquiètes.
Do you want me to help you? || Tu veux que je t'aide ?
Let me explain. || Laisse-moi t'expliquer.
My boss made me stay late. || Mon patron m'a fait rester tard.
Let's go! || Allons-y !
This film made me cry. || Ce film m'a fait pleurer.
Don't let him drive. || Ne le laisse pas conduire.
They let us use the meeting room. || Ils nous ont laissés utiliser la salle de réunion.
I enjoy reading. || J'aime lire.
Would you mind closing the window? || Ça te dérangerait de fermer la fenêtre ?
She avoids driving at night. || Elle évite de conduire la nuit.
He suggested taking a taxi. || Il a proposé de prendre un taxi.
Have you finished eating? || Tu as fini de manger ?
I can't stand waiting in queues. || Je ne supporte pas de faire la queue.
Keep going straight on. || Continue tout droit.
I'm interested in learning Spanish. || Ça m'intéresse d'apprendre l'espagnol.
I look forward to meeting you. || J'ai hâte de vous rencontrer.
Thanks for helping me. || Merci de m'avoir aidé.
She left without saying goodbye. || Elle est partie sans dire au revoir.
Before starting, let's have a coffee. || Avant de commencer, prenons un café.
He's good at fixing things. || Il est doué pour réparer les choses.
I'm thinking about changing jobs. || Je pense à changer de travail.
The house was built in 1990. || La maison a été construite en 1990.
English is spoken here. || Ici, on parle anglais.
The order will be delivered tomorrow. || La commande sera livrée demain.
My bike was stolen last night. || On m'a volé mon vélo hier soir.
The meeting has been cancelled. || La réunion a été annulée.
These cars are made in Germany. || Ces voitures sont fabriquées en Allemagne.
I was born in 1992. || Je suis né en 1992.
I was born in Paris. || Je suis né à Paris.
She was born in 1988. || Elle est née en 1988.
Where were you born? || Où es-tu né ?
My son was born last year. || Mon fils est né l'année dernière.
They were born in the same hospital. || Ils sont nés dans le même hôpital.
When were you born? || Quand es-tu né ?
I wish I had more time. || J'aimerais avoir plus de temps.
I wish I had studied harder at school. || J'aurais aimé travailler davantage à l'école.
I wish I knew the answer. || J'aimerais connaître la réponse.
She wishes she could speak Italian. || Elle aimerait savoir parler italien.
I wish you would stop talking. || J'aimerais que tu arrêtes de parler.
I wish I hadn't said that yesterday. || Je regrette d'avoir dit ça hier.
People are very friendly here. || Les gens sont très sympathiques ici.
Many people came to the concert. || Beaucoup de gens sont venus au concert.
People were waiting outside. || Des gens attendaient dehors.
How many people work here? || Combien de personnes travaillent ici ?
The people in this town are nice. || Les gens de cette ville sont gentils.
A lot of people don't know that. || Beaucoup de gens ne le savent pas.
She has three children. || Elle a trois enfants.
Two men are waiting for you. || Deux hommes t'attendent.
My feet hurt. || J'ai mal aux pieds.
I brush my teeth twice a day. || Je me brosse les dents deux fois par jour.
There are many women in the team. || Il y a beaucoup de femmes dans l'équipe.
The children are playing outside. || Les enfants jouent dehors.
Thanks for the information. || Merci pour les informations.
Can you give me some advice? || Tu peux me donner un conseil ?
The news is good. || Les nouvelles sont bonnes.
We need more information. || Nous avons besoin de plus d'informations.
I bought some new furniture. || J'ai acheté de nouveaux meubles.
How much luggage do you have? || Combien de bagages avez-vous ?
She gave me useful feedback. || Elle m'a fait des retours utiles.
How many people were there? || Combien de personnes y avait-il ?
I don't have much time. || Je n'ai pas beaucoup de temps.
There aren't many options. || Il n'y a pas beaucoup de choix.
How much money do you need? || De combien d'argent as-tu besoin ?
We don't have much information. || Nous n'avons pas beaucoup d'informations.
She doesn't have many friends here. || Elle n'a pas beaucoup d'amis ici.
There are fewer cars today. || Il y a moins de voitures aujourd'hui.
I drink less coffee now. || Je bois moins de café maintenant.
We need to make fewer mistakes. || Nous devons faire moins d'erreurs.
Less sugar, please. || Moins de sucre, s'il vous plaît.
There were fewer customers than last year. || Il y avait moins de clients que l'année dernière.
Fewer people came this time. || Moins de gens sont venus cette fois.
I don't have any money. || Je n'ai pas d'argent.
There aren't any chairs left. || Il ne reste plus de chaises.
Would you like some tea? || Tu veux du thé ?
There isn't any milk in the fridge. || Il n'y a pas de lait dans le frigo.
I need some help with this. || J'ai besoin d'aide pour ça.
We didn't see any animals. || Nous n'avons vu aucun animal.
I don't know anything. || Je ne sais rien.
Nobody came. || Personne n'est venu.
She didn't say anything. || Elle n'a rien dit.
We didn't see anybody. || Nous n'avons vu personne.
I can't find anywhere to park. || Je ne trouve nulle part où me garer.
Nothing happened. || Il ne s'est rien passé.
Life is beautiful. || La vie est belle.
I don't like coffee. || Je n'aime pas le café.
The coffee you made is great. || Le café que tu as fait est excellent.
Money isn't everything. || L'argent ne fait pas tout.
I'm interested in politics. || Je m'intéresse à la politique.
The music in this bar is too loud. || La musique de ce bar est trop forte.
I'm a teacher. || Je suis professeur.
She works as an engineer. || Elle travaille comme ingénieure.
He's a nurse. || Il est infirmier.
My father was a doctor. || Mon père était médecin.
I'd like to be a pilot. || J'aimerais être pilote.
She's an accountant in a big company. || Elle est comptable dans une grande entreprise.
I'll be back in an hour. || Je reviens dans une heure.
She studies at a university. || Elle étudie dans une université.
It's an honest answer. || C'est une réponse honnête.
I need an umbrella. || J'ai besoin d'un parapluie.
He has a European passport. || Il a un passeport européen.
I had an interesting day. || J'ai passé une journée intéressante.
We met different people. || Nous avons rencontré des gens différents.
They are important decisions. || Ce sont des décisions importantes.
She has two young children. || Elle a deux jeunes enfants.
`);
