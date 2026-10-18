// ====== RÈGLES (façon Projet Voltaire) ======
// Une ligne = une phrase. « phrase | correction » : la faute est entre astérisques. Sans « | » : phrase correcte.
function R(id, lvl, cat, name, x, txt) {
  return {id, lvl, cat, name, x, ex: txt.trim().split("\n").map(l => { const i = l.indexOf(" |"); return i < 0 ? [l.trim()] : [l.slice(0, i).trim(), l.slice(i + 2).trim()]; })};
}
const RULES = [
// ---------- CONJUGAISON ----------
R("s3","A1","Conjugaison","3e personne : le -s du présent","Au présent simple, avec he / she / it (ou un nom singulier), le verbe prend un -s : she works, it costs, my brother lives. Verbes en -ch, -sh, -o, -x : -es (watches, goes). Consonne + y : -ies (studies).",`
My sister *live* in London. | lives
He *watch* TV every evening. | watches
The shop opens at nine.
This bag *cost* fifty euros. | costs
She *studys* law at university. | studies
My boss *go* to Spain every summer. | goes
It rains a lot in November.
Everybody *know* the answer. | knows`),
R("doesnt","A1","Conjugaison","does / doesn't avec he, she, it","À la 3e personne, l'auxiliaire est does : he doesn't know, does she work? Le verbe qui suit reste à la base, sans -s.",`
He *don't* like coffee. | doesn't
*Do* your brother speak Spanish? | Does
She *doesn't knows* the answer. | doesn't know
It doesn't matter.
*Does she works* on Saturdays? | Does she work
My car *don't* start in the morning. | doesn't
Does he live near here?`),
R("neg","A1","Conjugaison","La négation : do not + verbe","On ne met pas « no » ou « not » directement devant un verbe ordinaire : I don't like, she doesn't work. Not se place seul seulement après be ou un modal (I'm not, I can't).",`
I *no like* fish. | don't like
She *not works* here anymore. | doesn't work
We don't have a car.
They *not understand* the question. | don't understand
I'm not ready yet.
He *no speaks* French. | doesn't speak`),
R("didbase","A2","Conjugaison","Après did : verbe à la base","Did porte déjà le passé : le verbe suivant reste à l'infinitif sans to. I didn't go (jamais didn't went), did you see?",`
I *didn't went* to the party. | didn't go
*Did you saw* the match? | Did you see
We didn't buy anything.
She *didn't called* me back. | didn't call
*Did he gave* you the keys? | Did he give
Did you enjoy the film?
They *didn't wanted* to leave. | didn't want`),
R("ilya","A1","Grammaire","« Il y a » = there is / there are","Il y a = there is (singulier) / there are (pluriel). Jamais « it has » ni « it is ». Au passé : there was / there were.",`
*It has* a lot of people here. | There are
*There is* many problems with this plan. | There are
There's a pharmacy around the corner.
*It is* a problem with my order. | There is
There were three messages for you.
*There was* fifty people at the meeting. | There were`),
R("age","A1","Conjugaison","L'âge : be, pas have","En anglais, on EST son âge : I'm 30 (years old). Jamais « I have 30 years ».",`
I *have 25 years*. | am 25
How old *have you*? | are you
My daughter is six.
She *has 40 years* old. | is 40 years
He's twenty-one years old.
My grandfather *has 90 years*. | is 90`),
R("avoirbe","A1","Conjugaison","avoir faim, froid, raison → be","Beaucoup d'expressions avec « avoir » se disent avec be : be hungry (faim), be thirsty (soif), be cold / hot (froid / chaud), be right / wrong (raison / tort), be afraid (peur), be sleepy (sommeil).",`
I *have hungry*. | am hungry
You *have right*, it's too expensive. | are right
Are you cold? I can close the window.
She *has fear* of spiders. | is afraid
We *have thirsty* after the walk. | are thirsty
He was wrong about the date.
I *have hot*, can you open the window? | am hot`),
R("agree","A2","Conjugaison","I agree (sans be)","Agree est un verbe : I agree, I don't agree, do you agree? « I am agree » n'existe pas.",`
*I am agree* with you. | I agree
*She is not agree* with the plan. | She doesn't agree
I totally agree.
*Are you agree*? | Do you agree
We *are agree* on the price. | agree
They don't agree with the decision.`),
R("prescont","A1","Conjugaison","Présent continu : be + -ing","Pour une action en cours, il faut be + verbe en -ing : I am working, she is sleeping. Le be ne disparaît jamais.",`
I *working* right now, can I call you back? | am working
She *is sleep* at the moment. | is sleeping
They're watching a film.
Look, it *snowing*! | is snowing
What *you are doing*? | are you doing
We're having lunch.`),
R("stative","A2","Conjugaison","Verbes d'état : pas de -ing","Want, need, know, understand, like, love, hate, believe, mean, own, seem ne se mettent normalement pas à la forme en -ing.",`
I *am wanting* a coffee. | want
She *is knowing* the answer. | knows
I need some help.
*Are you understanding* me? | Do you understand
This bag *is belonging* to my sister. | belongs
I don't know what he means.
He *is needing* a new computer. | needs`),
R("pastirreg","A2","Conjugaison","Prétérits irréguliers","Les verbes les plus courants sont irréguliers : buy → bought, think → thought, teach → taught, catch → caught, go → went, take → took, bring → brought.",`
She *buyed* a new phone. | bought
I *thinked* it was closed. | thought
We went to Italy last year.
He *catched* the last train. | caught
She *bringed* a cake. | brought
They *teached* me a lot. | taught
I took a taxi to the airport.
We *goed* home early. | went`),
R("ppart","B1","Conjugaison","Participes passés irréguliers","Après have / has / had et au passif, on utilise le participe passé (3e colonne) : gone, written, broken, eaten, seen, done, taken.",`
I have *went* there twice. | gone
She has *wrote* three emails this morning. | written
The window is *broke*. | broken
Have you *ate* yet? | eaten
I've seen this film before.
He has *took* the wrong bag. | taken
They have done a great job.
We had *forget* the tickets. | forgotten`),
R("pp","B1","Conjugaison","« depuis » + action qui dure : present perfect","« J'habite ici depuis 3 ans » : l'action dure encore, donc present perfect : I have lived here for 3 years. Jamais « I live here since… ».",`
I *live* here since 2018. | have lived
How long *are you* married? | have you been
She has been learning English for two years.
I *know* him since we were kids. | have known
We *work* together for five years. | have worked
He's had this car since 2015.
How long *do you wait*? | have you been waiting`),
R("ppfin","B1","Conjugaison","Moment terminé : prétérit","Avec yesterday, last week, ago, in 2010, when I was young : prétérit, jamais present perfect. I saw him yesterday.",`
I *have seen* him yesterday. | saw
She *has finished* school in 2015. | finished
We met two years ago.
*Have you been* to the cinema last night? | Did you go
They *have arrived* an hour ago. | arrived
When did you start working here?
I *have lost* my keys last week. | lost`),
R("ppexp","B1","Conjugaison","Expérience et résultat : present perfect","Pour une expérience de vie (ever, never), un résultat visible maintenant, ou avec just / already / yet sans date précise : present perfect.",`
*Did you ever been* to Japan? | Have you ever been
It's the best film I *ever saw*. | have ever seen
She has just left the office.
So far today, I *wrote* three reports. | have written
Have you finished your report yet?
How many times *did you visit* London so far? | have you visited`),
R("ago","A2","Conjugaison","ago = il y a","« Il y a 3 ans » = three years ago. Ago se place après la durée, avec le prétérit.",`
I moved here *since three years*. | three years ago
*There are two days* I called him. | Two days ago
They left an hour ago.
I saw her *there is a week*. | a week ago
We bought this house *ago ten years*. | ten years ago
She called five minutes ago.`),
R("sincefor","B1","Conjugaison","since / for","Since + point de départ (since Monday, since 2019, since I was a child). For + durée (for three days, for ten years, for a long time).",`
I've known her *since* ten years. | for
She has worked here *for* 2020. | since
We've been friends since childhood.
I've been waiting *since* two hours. | for
They have lived in Lyon *for* last summer. | since
He's been ill for a week.
It hasn't rained *for* Monday. | since`),
R("futwhen","B1","Conjugaison","when / as soon as + présent","Après when, as soon as, before, after, until (au sens futur), on emploie le présent, pas will : I'll call you when I arrive.",`
I'll call you when I *will arrive*. | arrive
Let me know as soon as you *will know*. | know
We'll start when everyone is here.
Wait here until I *will come* back. | come
She'll be happy when she hears the news.
Before you *will leave*, close the windows. | leave`),
R("willgoing","B1","Conjugaison","will ou be going to","Will : décision prise sur le moment, promesse, prédiction générale. Be going to : projet déjà décidé, ou prédiction basée sur ce qu'on voit.",`
The phone is ringing. *I'm going to answer* it! | I'll answer
Look at those clouds, it *will* rain. | is going to
I'm going to visit my parents this weekend, I booked the train.
- I'm thirsty. - *I'm going to get* you a glass of water. | I'll get
I promise I'll be on time.
Watch out! You *will* fall! | are going to`),
R("cond1","B1","Conjugaison","If + présent (jamais will)","Condition réelle : présent simple après if. If it rains, we'll stay home. Jamais « if it will rain ».",`
If it *will rain*, we'll stay home. | rains
I'll call you if I *will have* time. | have
If you heat ice, it melts.
If you *will need* help, ask me. | need
We'll miss the train if we don't hurry.
If she *will come*, I'll be happy. | comes`),
R("cond2","B1","Conjugaison","If + prétérit, would","Hypothèse : If I had money, I would travel. Pas de would après if. Avec be : If I were you.",`
If I *would have* more time, I'd travel. | had
If I *was* you, I'd accept. | were
If she knew, she would be angry.
If we *would live* in London, we'd see you more often. | lived
What would you do if you won the lottery?
I *will* buy a house if I had the money. | would`),
R("cond3","B2","Conjugaison","If + past perfect, would have","Regret sur le passé : If I had known, I would have come. Pas de would dans la partie en if.",`
If I *would have known*, I would have come. | had known
If we had left earlier, we *would catch* the train. | would have caught
If she had asked me, I would have helped her.
If you *told* me, I would have waited. | had told
I would have called if I had had your number.
If they *would have* studied, they would have passed. | had`),
R("modal","A2","Conjugaison","Modal + base verbale","Après can, must, should, will, could, might, may : verbe sans to et sans -s. She can swim, you should go.",`
She *cans* swim. | can
You *should to* call her. | should
He *must goes* now. | must go
We might arrive late.
Can you *to help* me? | help
It *could rains* later. | could rain
You should see a doctor.`),
R("haveto","B1","Conjugaison","have to / don't have to / mustn't","Have to = être obligé (has to à la 3e personne). Don't have to = pas obligé. Mustn't = interdit. Question : Do you have to…?",`
She *have to* leave early. | has to
*Do you must* work on Sunday? | Do you have to
You don't have to come if you're busy.
You *don't have to* smoke here, it's forbidden. | mustn't
I had to wait for an hour.
He *musts* wear a suit at work. | has to`),
R("usedto","B1","Conjugaison","used to / be used to","Used to + base = habitude passée (I used to smoke). Be used to + -ing = être habitué à (I'm used to working late).",`
I *use to* play tennis when I was young. | used to
I'm used to *work* at night. | working
She used to live in Berlin.
*Did you used to* have long hair? | Did you use to
He isn't used to driving on the left.
We *are used to go* there every summer as kids. | used to go`),
R("wouldlike","A2","Conjugaison","would like to / want + to","Would like, want, need, decide, hope, plan, forget sont suivis de to + base : I'd like to go, she wants to stay.",`
I would like *eat* something. | to eat
She wants *go* home. | to go
I'd like a coffee, please.
We decided *going* by train. | to go
You don't need *come* early. | to come
I hope to see you soon.
They plan *visit* Rome. | to visit`),
R("wantyou","B1","Conjugaison","want someone to do","Je veux que tu viennes = I want you to come. Jamais « I want that you come ». Pareil pour would like, expect, ask.",`
I want *that you come* with me. | you to come
She'd like *that we call* her tomorrow. | us to call
My boss wants me to finish the report today.
They asked *that I wait*. | me to wait
I don't want you to worry.
Do you want *that I help* you? | me to help`),
R("letmake","B1","Conjugaison","let / make + base verbale","Let someone do (laisser faire) et make someone do (faire faire) : sans to. Let me explain, it made me laugh.",`
Let me *to explain*. | explain
My boss *made me to* stay late. | made me
Let's go!
This film made me *to cry*. | cry
Don't let him *to drive*. | drive
They let us use the meeting room.`),
R("enjoy","B1","Conjugaison","enjoy, avoid, mind, finish + -ing","Enjoy, avoid, finish, mind, suggest, keep, consider, can't stand sont suivis de -ing : enjoy reading, avoid driving.",`
I enjoy *to read*. | reading
Would you mind *to close* the window? | closing
She avoids driving at night.
He suggested *to take* a taxi. | taking
Have you finished *to eat*? | eating
I can't stand waiting in queues.
Keep *to go* straight on. | going`),
R("ing","B1","Conjugaison","Préposition + -ing","Après une préposition (in, of, about, before, after, without, for, at, et to dans look forward to / be used to), le verbe prend -ing.",`
I'm interested *in learn* Spanish. | in learning
I look forward *to meet* you. | to meeting
Thanks for helping me.
She left *without say* goodbye. | without saying
Before *to start*, let's have a coffee. | starting
He's good at fixing things.
I'm thinking *about change* jobs. | about changing`),
R("passive","B1","Conjugaison","Le passif : be + participe passé","Passif = be (au bon temps) + participe passé : English is spoken here, the house was built in 1990, it will be delivered tomorrow.",`
The house *was build* in 1990. | was built
English *is speak* here. | is spoken
The order will be delivered tomorrow.
My bike *stole* last night. | was stolen
The meeting *has cancelled*. | has been cancelled
These cars are made in Germany.
I was born in 1992.`),
R("born","A2","Conjugaison","to be born : toujours au passé","Naître = to be born, au passé quand on parle de sa naissance : I was born in 1990. Jamais « I am born » ni « I born ».",`
I *am born* in Paris. | was born
She *born* in 1988. | was born
Where were you born?
My son *is born* last year. | was born
They were born in the same hospital.
When *are you born*? | were you born`),
R("wish","B2","Conjugaison","I wish + prétérit / past perfect","Regret présent : I wish I had more time (prétérit). Regret passé : I wish I had studied (past perfect). Souhait d'un changement chez l'autre : I wish you would stop.",`
I wish I *have* more time. | had
I wish I *studied* harder at school. | had studied
I wish I knew the answer.
She wishes she *can* speak Italian. | could
I wish you would stop talking.
I wish I *didn't say* that yesterday. | hadn't said`),
// ---------- GRAMMAIRE ----------
R("people","A1","Grammaire","people est pluriel","People (des gens) est toujours pluriel : people are, people think. Une personne = a person.",`
People *is* very friendly here. | are
Many *peoples* came to the concert. | people
People were waiting outside.
How many *persons* work here? | people
The people in this town *is* nice. | are
A lot of people don't know that.`),
R("pluralirr","A1","Grammaire","Pluriels irréguliers","Child → children, man → men, woman → women, person → people, foot → feet, tooth → teeth, mouse → mice.",`
She has three *childs*. | children
Two *mans* are waiting for you. | men
My feet hurt.
I brush my *tooths* twice a day. | teeth
There are many *womans* in the team. | women
The children are playing outside.`),
R("uncount","A2","Grammaire","Indénombrables : information, advice, news…","Information, advice, furniture, luggage, homework, news, feedback, equipment, research ne prennent ni -s ni a/an. Pour compter : a piece of advice.",`
Thanks for the *informations*. | information
Can you give me *an advice*? | some advice
The news *are* good. | is
We need more information.
I bought some new *furnitures*. | furniture
How much luggage do you have?
She gave me *a useful feedback*. | useful feedback`),
R("muchmany","A2","Grammaire","much / many","Many + dénombrable pluriel (many friends), much + indénombrable (much time, much money). En phrase affirmative, on préfère a lot of.",`
How *much* people were there? | many
I don't have *many* time. | much
There aren't many options.
How *many* money do you need? | much
We don't have much information.
She doesn't have *much* friends here. | many`),
R("fewer","B1","Grammaire","fewer / less","Fewer + dénombrable (fewer cars, fewer people), less + indénombrable (less traffic, less money).",`
There are *less* cars today. | fewer
I drink less coffee now.
We need to make *less* mistakes. | fewer
*Fewer* sugar, please. | Less
There were fewer customers than last year.
*Less* people came this time. | Fewer`),
R("someany","A2","Grammaire","some / any","Some en phrase affirmative et pour une offre ou une demande. Any en phrase négative et dans la plupart des questions.",`
I don't have *some* money. | any
There aren't *some* chairs left. | any
Would you like some tea?
There isn't *some* milk in the fridge. | any
I need some help with this.
We didn't see *some* animals. | any`),
R("doubleneg","B1","Grammaire","Pas de double négation","En anglais, une seule négation par phrase : I don't know anything (ou I know nothing). Jamais « I don't know nothing ».",`
I *don't know nothing*. | don't know anything
*Nobody didn't come*. | Nobody came
She didn't say anything.
We *didn't see nobody*. | didn't see anybody
I *can't find nowhere* to park. | can't find anywhere
Nothing happened.`),
R("article","A2","Grammaire","Généralités : pas de the","Pour parler en général, pas d'article : I love music, life is short, dogs are loyal, money isn't everything. The = quelque chose de précis.",`
*The life* is beautiful. | Life
I don't like *the coffee*. | coffee
The coffee you made is great.
*The money* isn't everything. | Money
I'm interested in *the politics*. | politics
The music in this bar is too loud.`),
R("articlejob","A2","Grammaire","a / an devant un métier","Devant un métier ou une fonction au singulier, on met a / an : I'm a teacher, she's an engineer.",`
I'm *teacher*. | a teacher
She works as *engineer*. | an engineer
He's a nurse.
My father was *doctor*. | a doctor
I'd like to be a pilot.
She's *accountant* in a big company. | an accountant`),
R("aan","A1","Grammaire","a ou an : c'est le son qui compte","An devant un SON voyelle (an apple, an hour, an MBA), a devant un SON consonne (a university, a European, a one-way ticket).",`
I'll be back in *a* hour. | an
She studies at *an* university. | a
It's an honest answer.
I need *a* umbrella. | an
He has *an* European passport. | a
I had an interesting day.`),
R("adjinv","A1","Grammaire","Adjectifs invariables","Les adjectifs anglais ne s'accordent jamais : different people, two big houses, important decisions.",`
We met *differents* people. | different
They are *importants* decisions. | important
She has two young children.
These are *expensives* shoes. | expensive
I have *others* questions. | other
They're nice people.`),
R("adjorder","A1","Grammaire","Adjectif avant le nom","L'adjectif se place avant le nom : a red car, an interesting book, a big old house.",`
I bought a *car red*. | red car
It's *a film interesting*. | an interesting film
She lives in a small village.
We stayed in a *hotel cheap*. | cheap hotel
He's *a person nice*. | a nice person
It was a long day.`),
R("possessive","A2","Grammaire","Le génitif : my brother's car","La voiture de mon frère = my brother's car. Pas d'article devant un prénom : John's car (pas the John's car).",`
I borrowed *the car of my brother*. | my brother's car
*The Paul's* house is huge. | Paul's
My parents' flat is in the centre.
It's *the birthday of my mother*. | my mother's birthday
This is my boss's office.
I met *the wife of Tom*. | Tom's wife`),
R("pronoun","A1","Grammaire","I / me, he / him…","Sujet : I, he, she, we, they. Complément : me, him, her, us, them. Par politesse, on se met en dernier : my friend and I.",`
*Me and my friend* went to the cinema. | My friend and I
Can you send it to *I*? | me
She called us yesterday.
Between you and *I*, he's wrong. | me
*Him* and his wife live in Spain. | He
Give them the keys.`),
R("reflexive","A2","Grammaire","Verbes pronominaux français, pas en anglais","Se lever, se souvenir, se sentir, se détendre, se dépêcher, se marier… ne prennent pas de pronom en anglais : I get up, I remember, relax!",`
I *wake me up* at seven. | wake up
I don't *remember me* his name. | remember
Hurry up, we're late!
*Relax yourself*, everything is fine. | Relax
She *feels herself* tired today. | feels
They got married last year.`),
R("every","A2","Grammaire","every / each + singulier","Every et each sont suivis d'un nom singulier et d'un verbe au singulier : every day is different, each room has a TV.",`
Every student *have* a laptop. | has
*Every days are* the same. | Every day is
Each room has a balcony.
Everyone *are* here. | is
Every morning I go for a run.
Each of the rooms *have* a TV. | has`),
R("alltheday","A2","Grammaire","« tous les jours » = every day","Tous les jours = every day. Toute la journée = all day. Jamais « all the days ».",`
I go to the gym *all the days*. | every day
She worked *all the day*. | all day
I call my mum every Sunday.
We see each other *all the weeks*. | every week
It rained all day.
He checks his emails *all the mornings*. | every morning`),
R("most","B1","Grammaire","most people (sans the of)","La plupart des gens = most people (pas the most of people). Most of + the / my / these : most of the time, most of my friends.",`
*The most of* people work from home now. | Most
*Most of people* like music. | Most people
Most of my friends live in Paris.
I spend *the most of* my time at work. | most of
Most shops close at 7 pm.
*The most part of* the team agreed. | Most of`),
R("relative","A2","Grammaire","who / which / that","Who pour les personnes, which pour les choses, that pour les deux. Whose = dont (possession).",`
The man *which* called you is my boss. | who
The book *who* I'm reading is great. | which
The woman who lives next door is a doctor.
This is the hotel *who* I told you about. | which
The car that I bought is red.
I have a friend *which* speaks Chinese. | who`),
R("toenough","B1","Grammaire","too / enough","Too + adjectif (too hot). Adjectif + enough (big enough), enough + nom (enough time). Not ... enough.",`
This room isn't *enough big*. | big enough
It's too *much* expensive. |
We don't have enough chairs.
She's *enough old* to drive. | old enough
The coffee is too hot to drink.
I'm *too much* tired to go out. | too`),
R("sosuch","B1","Grammaire","so / such","So + adjectif seul (so nice). Such + (a) + adjectif + nom (such a nice day, such good people).",`
It's *so* a beautiful day. | such
She's *such* tired. | so
They are such nice people.
I've never seen *so* a big house. | such
It was so funny!
He made so many mistakes.`),
R("adverb","A2","Grammaire","Adjectif ou adverbe (-ly)","Pour décrire comment on fait quelque chose : adverbe. He drives carefully, she speaks well. Good → well (adverbe).",`
He drives very *careful*. | carefully
She speaks English very *good*. | well
You did that perfectly.
Please talk *quiet*, the baby is sleeping. | quietly
The time passed *quick*. | quickly
She sings beautifully.`),
R("wordorder","B1","Grammaire","Ordre des mots : sujet + verbe + complément","Rien entre le verbe et son complément : I like coffee very much (pas I like very much coffee). Always, often, never se placent avant le verbe, mais après be.",`
I *like very much coffee*. | like coffee very much
She *speaks very well English*. | speaks English very well
I often go to the cinema.
I *always am* late. | am always
He *drinks never* alcohol. | never drinks
We usually have dinner at eight.`),
R("comp","A2","Grammaire","Comparatif : -er ou more","Adjectif court : -er (cheaper, bigger). Long : more (more expensive). Irréguliers : good → better, bad → worse, far → further. Jamais more + -er.",`
This phone is *more cheap*. | cheaper
Her English is *more good* than mine. | better
It's *more easier* now. | easier
This hotel is more comfortable.
The weather is *badder* today. | worse
London is bigger than Paris.`),
R("than","A2","Grammaire","than après un comparatif","Pour comparer : than (bigger than). Ni that, ni then, ni as.",`
He's taller *then* his brother. | than
It's cheaper *that* the other one. | than
She's older than me.
This job is better *as* my old one. | than
Trains are faster than buses.
It's more expensive *that* I thought. | than`),
R("superl","A2","Grammaire","Superlatif : the -est / the most","Court : the biggest, the cheapest. Long : the most expensive. Irréguliers : the best, the worst. Lieu : in (the best in the world).",`
It's the *most big* city in the country. | biggest
She's the best student *of* the class. | in
This is the cheapest option.
It was the *baddest* day of my life. | worst
He's the *more* famous actor in Spain. | most
It's the most beautiful place I've ever seen.`),
R("asas","B1","Grammaire","as … as / the same as","Aussi … que = as … as. Le même que = the same as. Jamais « as … than » ni « the same than ».",`
She's as tall *than* her mother. | as
I have the same phone *than* you. | as
This one is as good as the other.
It's not as easy *that* it looks. | as
We have the same problem as last year.
He's *as much* tall as me. | as`),
R("muchvery","B1","Grammaire","very ou much","Very + adjectif simple (very tired). Much / far + comparatif (much bigger). Very much après le verbe (I like it very much).",`
I'm *much* tired today. | very
This flat is *very* bigger than ours. | much
It's very cold outside.
Thank you *very*! | very much
She's much better now.
It's *very* more expensive in Paris. | much`),
R("onefthe","A2","Grammaire","one of + pluriel","One of my friends, one of the best films : après one of, le nom est au pluriel.",`
He's one of my best *friend*. | friends
It's one of the most beautiful *city* in Europe. | cities
One of my colleagues is ill.
She's one of the best *player* in the team. | players
One of the problems is the price.
This is one of my favourite *song*. | songs`),
R("numbers","A2","Grammaire","Les nombres : hundred, thousand, dozen","Hundred, thousand, million sont invariables après un nombre : two hundred people, three thousand euros. A dozen eggs (sans of).",`
It costs two *hundreds* euros. | hundred
There were three *thousands* people. | thousand
Hundreds of people came.
I bought a dozen *of* eggs. |
The company has five hundred employees.
It's worth two *millions* dollars. | million`),
R("howcalled","A2","Grammaire","« Comment ça s'appelle ? »","Comment ça s'appelle = What is it called? Comment tu t'appelles = What's your name? Jamais « How is it called? » ni « How do you call yourself? ».",`
*How is called this* in English? | What is this called
*How do you call yourself*? | What's your name
What's this dish called?
*How is it called*, this app? | What is it called
What's the name of the street?
*How you call* this in English? | What do you call`),
R("question","A2","Grammaire","Questions : auxiliaire avant le sujet","Une question a besoin d'un auxiliaire (do, does, did, be, have, modal) avant le sujet : Where do you live? What did she say?",`
Where *you live*? | do you live
What *she said*? | did she say
Where does he work?
Why *you are* late? | are you
How much does it cost?
What time *the film starts*? | does the film start`),
R("indirect","B1","Grammaire","Questions indirectes : ordre normal","Dans une question indirecte (Do you know…, Can you tell me…, I wonder…), sujet + verbe dans l'ordre normal, sans do.",`
Can you tell me where *is the station*? | the station is
Do you know what time *does it open*? | it opens
I wonder where she lives.
I don't know what *is his name*. | his name is
Could you tell me how much it costs?
Do you know where *did he go*? | he went`),
// ---------- PRÉPOSITIONS ----------
R("depend","A2","Prépositions","depend on","On dit depend on / it depends on. Jamais « depend of ».",`
It *depends of* the weather. | depends on
Our plans depend on the budget.
That *depends of* you. | depends on
The price *depends from* the season. | depends on
It depends on the traffic.
Everything *depends of* the results. | depends on`),
R("prepverb","A2","Prépositions","listen to, wait for, look at, pay for","Ces verbes exigent leur préposition : listen to, wait for, look at, ask for, pay for, look for (chercher).",`
I'm *listening music*. | listening to music
We're *waiting the bus*. | waiting for the bus
Look at this picture!
I'm *looking my keys*. | looking for my keys
Who *paid the drinks*? | paid for the drinks
She asked for the bill.`),
R("noprep","B1","Prépositions","Sans préposition : discuss, call, enter, answer","Discuss something, call / phone someone, enter a room, answer a question, reach a place, attend a meeting, ask someone : pas de préposition.",`
Let's *discuss about* it later. | discuss
I'll *call to* her tonight. | call
He entered the room quietly.
Please *answer to* my question. | answer
We *reached to* the hotel at midnight. | reached
I asked my boss for a day off.
I need to *phone to* the bank. | phone`),
R("inonat_time","A1","Prépositions","in / on / at (le temps)","At + heure (at 6 pm, at night, at the weekend en UK). On + jour, date (on Monday, on 3 May). In + mois, année, saison, moment de la journée (in June, in 2020, in the morning).",`
See you *in* Monday. | on
I was born *on* 1995. | in
The meeting is at 10 o'clock.
I work better *at* the morning. | in
Her birthday is *in* 12 March. | on
We usually go skiing in winter.
The shop closes *on* 7 pm. | at`),
R("inonat_place","A2","Prépositions","in / on / at (le lieu)","In + ville, pays, espace fermé (in London, in the car). On + transport collectif, surface (on the bus, on the table). At + point précis, adresse, événement (at home, at work, at the station).",`
I'm *in* the bus, I'll be there soon. | on
She lives *at* London. | in
I'll meet you at the station.
He's still *in* work. | at
The keys are on the table.
We stayed *in* home all weekend. | at`),
R("transport","A2","Prépositions","by car, on foot","Moyen de transport : by car, by train, by plane, by bike (sans article). À pied : on foot. Avec un article : in my car, on the train.",`
I go to work *with the car*. | by car
We came *in foot*. | on foot
She travels by train.
They went to Spain *with the plane*. | by plane
I usually go by bike.
He comes to school *by feet*. | on foot`),
R("adjprep","B1","Prépositions","married to, good at, afraid of…","Married to, good at, afraid of, interested in, proud of, tired of, responsible for, different from, keen on.",`
She's married *with* a doctor. | to
I'm not very good *in* maths. | at
He's afraid of dogs.
I'm interested *by* history. | in
We're very proud *on* you. | of
I'm tired of waiting.
This is different *of* what I expected. | from`),
R("arrive","A2","Prépositions","arrive in / arrive at, go home","Arrive in + ville, pays (arrive in Paris). Arrive at + lieu précis (arrive at the airport). Jamais « arrive to ». Go home, come home : sans to.",`
We arrived *to* London at noon. | in
What time do you arrive *to* the airport? | at
I got home late.
I want to go *to home*. | home
She arrived in Spain yesterday.
He came *to home* at midnight. | home`),
R("during","B1","Prépositions","for ou during","For + durée (for two hours). During + événement ou période nommée (during the meeting, during the summer).",`
I waited *during* three hours. | for
She slept *for* the film. | during
We talked during lunch.
I lived in Spain *during* five years. | for
It rained for the whole week.
Don't use your phone *for* the meeting. | during`),
R("untilby","B2","Prépositions","until ou by","Until = jusqu'à (une action qui dure jusqu'à ce moment). By = au plus tard, d'ici (une échéance).",`
Please send me the report *until* Friday. | by
I'll wait here *by* 6 pm. | until
The shop is open until 8.
We need an answer *until* tomorrow. | by
I'll be in the office until noon.
The invoice must be paid *until* the end of the month. | by`),
// ---------- ORTHOGRAPHE ----------
R("its","A2","Orthographe","its / it's","It's = it is / it has. Its = possessif (son, sa pour une chose ou un animal).",`
The dog wagged *it's* tail. | its
*Its* raining again. | It's
It's been a long day.
The company changed *it's* logo. | its
*Its* not my fault. | It's
The city is famous for its museums.`),
R("their","A2","Orthographe","their / there / they're","Their = leur. There = là, il y a. They're = they are.",`
*Their* going to be late. | They're
I left my keys over *their*. | there
Their house is beautiful.
*There* car is very old. | Their
I think *their* is a problem. | there
They're my best friends.`),
R("your","A2","Orthographe","your / you're","Your = ton, ta, tes, votre, vos. You're = you are.",`
*Your* welcome! | You're
Is this *you're* bag? | your
You're right.
*Your* going to love it. | You're
Thanks for *you're* help. | your
Your English is getting better.`),
R("whose","B1","Orthographe","whose / who's","Whose = à qui / dont. Who's = who is / who has.",`
*Who's* phone is this? | Whose
*Whose* coming tonight? | Who's
The man whose car was stolen called the police.
I know a guy *who's* sister is a lawyer. | whose
Who's been using my computer?
*Whose* the new manager? | Who's`),
R("tootwo","A1","Orthographe","to / too / two","To = à, vers, ou devant un verbe. Too = trop, aussi. Two = deux.",`
It's *to* expensive. | too
I want *too* go home. | to
I'm hungry too.
We have *to* children. | two
She's going to London.
I'm *to* tired to work. | too`),
R("where","A2","Orthographe","where / were / we're","Where = où. Were = prétérit de be (you were, they were). We're = we are.",`
*Were* do you live? | Where
They *where* very happy. | were
We're going to be late.
*Where* you at home yesterday? | Were
*Were* ready to start. | We're
Where were you born?`),
R("hear","A1","Orthographe","hear / here, know / no / now","Hear = entendre, here = ici. Know = savoir, no = non, now = maintenant.",`
Come *hear*, please. | here
I can't *here* you, the music is too loud. | hear
I know her very well.
I *no* the answer. | know
We need to leave right now.
There's *know* milk left. | no`),
R("buyby","A1","Orthographe","buy / by / bye","Buy = acheter. By = par, à côté de, d'ici (une date). Bye = au revoir.",`
I need to *by* some bread. | buy
The book was written *buy* a French author. | by
Bye, see you tomorrow!
Can you send it *buy* Monday? | by
She wants to buy a new car.
We went there *buy* train. | by`),
R("quiet","B1","Orthographe","quiet / quite","Quiet = calme, silencieux. Quite = assez, plutôt.",`
The street is very *quite* at night. | quiet
It's *quiet* expensive. | quite
Please be quiet, I'm on the phone.
I'm not *quiet* sure. | quite
It's a quiet neighbourhood.
The film was *quiet* good. | quite`),
R("advice","B1","Orthographe","advice / advise","Advice = le conseil (nom, indénombrable). Advise = conseiller (verbe).",`
Can you give me some *advise*? | advice
I *advice* you to book early. | advise
Thanks for your advice.
What do you *advice* me to do? | advise
She gave me very good *advise*. | advice
The doctor advised me to rest.`),
R("accept","B1","Orthographe","accept / except","Accept = accepter. Except = sauf.",`
I *except* your offer. | accept
Everyone came *accept* Paul. | except
We accept credit cards.
The shop is open every day *accept* Sunday. | except
They didn't *except* my apology. | accept
I like all vegetables except carrots.`),
R("weather","B1","Orthographe","weather / whether","Weather = le temps (météo). Whether = si (entre deux options).",`
The *whether* is lovely today. | weather
I don't know *weather* he's coming. | whether
What's the weather like in Manchester?
I'm not sure *weather* to accept or not. | whether
The *whether* forecast says rain. | weather
She asked whether we needed help.`),
R("affect","B2","Orthographe","affect / effect","Affect = verbe (affecter, influencer). Effect = nom (l'effet).",`
The strike will *effect* our sales. | affect
The new law had a big *affect* on prices. | effect
Stress can affect your health.
What are the side *affects*? | effects
The weather *effects* my mood. | affects
The changes will take effect in May.`),
R("lose","A2","Orthographe","lose / loose","Lose = perdre. Loose = lâche, desserré (adjectif).",`
Don't *loose* your ticket. | lose
These jeans are too loose.
I always *loose* my keys. | lose
We can't afford to *loose* this client. | lose
The screw is loose.
Did you *loose* your phone again? | lose`),
R("double","B1","Orthographe","Doubler la consonne finale","Mot court en consonne + voyelle + consonne : on double la consonne devant -ed, -ing, -er, -est : stop → stopped, run → running, big → bigger.",`
The bus *stoped* suddenly. | stopped
I'm *runing* late. | running
This is the *bigest* room. | biggest
She's planning a trip.
We *shoped* all afternoon. | shopped
He's sitting next to me.
They *swiming* in the lake. | are swimming`),
R("edrop","B1","Orthographe","Le e final devant -ing","On enlève le e muet devant -ing : make → making, write → writing, come → coming. Write et come ne doublent rien.",`
I'm *makeing* dinner. | making
She's *writting* an email. | writing
Are you coming tonight?
He's *comming* tomorrow. | coming
I'm *haveing* a shower. | having
They're taking the train.`),
R("ies","A2","Orthographe","Pluriels en -ies et -ves","Consonne + y → -ies (city → cities, baby → babies). Mais voyelle + y → -s (days, keys). Beaucoup de mots en -f / -fe → -ves (knife → knives, life → lives).",`
I've visited many *citys*. | cities
The *babys* are sleeping. | babies
I lost my keys.
Be careful with the *knifes*. | knives
We spent three days in Rome.
Cats have nine *lifes*. | lives`),
R("capitals","A1","Orthographe","Majuscules : jours, mois, langues, I","En anglais, majuscule pour les jours, les mois, les langues, les nationalités et le pronom I.",`
See you on *monday*. | Monday
I speak *english* and Spanish. | English
My birthday is in July.
Yesterday *i* went to the cinema. | I
She's *french* but she lives in Italy. | French
We met on a Tuesday in October.`),
R("ful","B1","Orthographe","-ful : un seul l","Le suffixe -ful ne prend qu'un l : beautiful, careful, useful, helpful. L'adverbe garde les deux : carefully.",`
What a *beautifull* house! | beautiful
Be *carefull*! | careful
This app is really useful.
Thanks, you've been very *helpfull*. | helpful
Drive carefully.
It was a *wonderfull* trip. | wonderful`),
R("fr_spell","B1","Orthographe","Mots proches du français","Attention à l'orthographe calquée sur le français : example, address, apartment, language, development, comfortable, responsible, independent, environment.",`
For *exemple*, you can take the bus. | example
What's your email *adress*? | address
Our apartment is on the third floor.
English is a useful *langage*. | language
This bed is very *confortable*. | comfortable
Who is *responsable* for this project? | responsible
We need to protect the environment.
She works in business *developpement*. | development`),
R("spell","B1","Orthographe","Mots piégeux","Receive (e avant i après c), which, until, tomorrow, definitely, necessary, beginning, business.",`
Did you *recieve* my email? | receive
I'll wait *untill* six. | until
See you tomorrow!
*Wich* one do you prefer? | Which
I'll *definately* come. | definitely
Is it *necesary* to book? | necessary
He runs his own business.
It's only the *begining*. | beginning`),
R("apos","A2","Orthographe","Pas d'apostrophe pour le pluriel","Un simple pluriel ne prend jamais d'apostrophe : two apples, the 1990s. L'apostrophe sert à la possession (Tom's car) ou à la contraction (it's).",`
I bought two *apple's*. | apples
We sell *phone's* and laptops. | phones
My parents' house is near the sea.
I love the *1990's*. | 1990s
The kids are at school.
All the *shop's* are closed on Sunday. | shops`),
// ---------- VOCABULAIRE ----------
R("makedo","A2","Vocabulaire","make / do","Make = fabriquer, produire (make a mistake, a decision, money, a phone call, an effort, progress). Do = tâches, activités (do homework, the dishes, sport, a job, a favour, business).",`
I *did* a mistake. | made
Can you *make* me a favour? | do
She made a decision.
I *make* sport three times a week. | do
We need to *do* an effort. | make
I'll do the shopping.
He *makes* his homework every evening. | does`),
R("saytell","A2","Vocabulaire","say / tell","Tell + personne (tell me, tell her the truth, tell a story). Say + chose (say hello, say that…). Say something to someone.",`
He *said me* the truth. | told me
She *told* that she was tired. | said
Tell me what happened.
Can you *say* me your name? | tell
He told us a funny story.
*Tell* hello to your parents for me. | Say`),
R("borrow","A2","Vocabulaire","borrow / lend","Borrow = emprunter (borrow from). Lend = prêter (lend to). Can I borrow your pen? / Can you lend me your pen?",`
Can you *borrow* me your car? | lend
I *lent* a book from the library. | borrowed
Could you lend me ten euros?
Can I *lend* your phone for a minute? | borrow
She borrowed money from her parents.
My brother *borrowed* me his bike. | lent`),
R("learnteach","A2","Vocabulaire","learn / teach","Learn = apprendre (soi-même). Teach = apprendre à quelqu'un, enseigner (teach - taught - taught).",`
My mother *learned* me to cook. | taught
She *learns* English in a high school (she's the teacher). | teaches
I'm learning to drive.
Can you *learn* me some words in Italian? | teach
He taught me how to swim.
Who *learnt* you that? | taught`),
R("lookwatch","A2","Vocabulaire","look / see / watch","See = voir (sans effort). Look at = regarder (diriger les yeux). Watch = regarder quelque chose qui bouge (TV, film, match).",`
I *looked* TV all evening. | watched
Did you *look* the match last night? | watch
Look at this photo!
I *watched* her in the street yesterday. | saw
Can you see the sea from your window?
We *saw* a film at home. | watched`),
R("remember","B1","Vocabulaire","remember / remind","Remember = se souvenir de. Remind = rappeler à quelqu'un (remind me to call him). Remind of = faire penser à.",`
*Remember me* to call the bank. | Remind me
This song *remembers* me of my holidays. | reminds
I remember our first meeting.
Can you *remember* me tomorrow? | remind
She reminds me of my sister.
Please *remember* him about the meeting. | remind`),
R("winearn","B1","Vocabulaire","win / earn / gain","Earn = gagner (de l'argent en travaillant). Win = gagner (un match, un prix, la loterie). Gain = gagner, prendre (du poids, de l'expérience).",`
How much do you *win* per month? | earn
Our team *earned* the match. | won
She earns a good salary.
I *won* a lot of experience in this job. | gained
He won the first prize.
We *win* more money than last year. | earn`),
R("riseraise","B2","Vocabulaire","rise / raise","Raise = lever, augmenter quelque chose (verbe avec complément) : raise your hand, raise prices. Rise = monter tout seul (rise - rose - risen) : prices rose.",`
*Rise* your hand if you have a question. | Raise
Prices *raised* by 5% last year. | rose
The sun rises at six.
They want to *rise* the rent again. | raise
Sales have risen sharply.
The company *rose* its prices. | raised`),
R("funfunny","B1","Vocabulaire","fun / funny","Funny = drôle, qui fait rire. Fun = amusant, agréable (une activité, un moment).",`
That joke is so *fun*! | funny
We had a lot of *funny* at the party. | fun
The trip was really fun.
He's a very *fun* guy, he always makes me laugh. | funny
Skiing is fun.
It was a *funny* weekend, we did lots of activities. | fun`),
R("tripwork","A2","Vocabulaire","trip / travel, job / work","Travel = voyager (verbe) ou le voyage en général. Un voyage = a trip (a journey pour le trajet). Work = le travail en général (indénombrable). Un emploi = a job.",`
Have a nice *travel*! | trip
I found *a work* in a bank. | a job
I love travelling.
How was your *travel* to Rome? | trip
I have a lot of work this week.
She's looking for *a new work*. | a new job`),
R("hardhardly","B1","Vocabulaire","hard / hardly","Hard = dur, durement (adjectif et adverbe). Hardly = à peine, presque pas.",`
He works very *hardly*. | hard
I *hard* know him. | hardly
She studied hard for the exam.
It's *hardly* to understand. | hard
I could hardly hear you.
They tried *hardly* but they failed. | hard`),
R("homehouse","A2","Vocabulaire","home / house","House = la maison (le bâtiment). Home = chez soi, le foyer : at home, go home.",`
I'm staying at *house* tonight. | home
Let's go *to house*. | home
They bought a big house in the country.
I work from *house* on Fridays. | home
Make yourself at home!
I'll be *at the house* at six (= chez moi). | home`),
R("eding","A2","Vocabulaire","-ed / -ing : bored / boring","-ed = ce qu'on ressent (I'm bored, interested, tired). -ing = ce qui le provoque (the film is boring, interesting, tiring).",`
I'm *boring*, let's go out. | bored
The lesson was very *interested*. | interesting
She was surprised by the news.
I'm so *exciting* about the trip! | excited
It was a *tired* day. | tiring
I'm confused, can you explain again?`),
R("actually","A2","Vocabulaire","Faux ami : actually","Actually = en fait, en réalité. Actuellement = currently, at the moment, now.",`
The museum is *actually* closed for renovation until June. | currently
Actually, I don't agree with you.
She's *actually* unemployed, but she starts a new job in May. | currently
I thought he was English, but actually he's Irish.
*Actually*, we have 50 employees; next year we'll have 70. | Currently`),
R("eventually","B1","Vocabulaire","Faux amis : eventually, possibly","Eventually = finalement, au bout du compte. Éventuellement = possibly, maybe, if necessary.",`
After three hours, we *possibly* found the hotel. | eventually
We could *eventually* meet next week, if you're free. | possibly
He eventually accepted the offer.
I can *eventually* help you if you need. | possibly
It took years, but she eventually succeeded.`),
R("faux","B1","Vocabulaire","Faux amis : library, sensible, attend","Library = bibliothèque (librairie = bookshop). Sensible = raisonnable (sensible = sensitive). Attend = assister à (assist = aider).",`
I bought this novel in a *library*. | bookshop
She's very *sensible*, she cries at every film. | sensitive
I *assisted* the meeting yesterday. | attended
That's a sensible decision.
I borrowed three books from the library.
He *assisted to* the conference in Berlin. | attended`),
R("faux2","B1","Vocabulaire","Faux amis : demand, rest, pass an exam","Demander = ask (demand = exiger). Rester = stay (rest = se reposer). Passer un examen = take / sit an exam (pass = réussir).",`
Can I *demand* you a question? | ask
I'm going to *rest* at home tonight, I won't go out. | stay
I need to rest, I'm exhausted.
I *passed* my exam yesterday but I don't know the results yet. | took
She asked me for help.
We *rested* in a nice hotel for three nights. | stayed`),
R("faux3","B2","Vocabulaire","Faux amis : resume, journey, propose, location","Résumer = summarize (resume = reprendre). Journée = day (journey = trajet). Proposer = suggest / offer (propose = proposer formellement, demander en mariage). Location = rental (location = emplacement).",`
Can you *resume* the article in two lines? | summarize
Have a nice *journey* at work! | day
The meeting will resume after lunch.
I *propose you to come* with us. | suggest that you come
We need a car *location* for the weekend. | rental
The location of the hotel is perfect.`),
R("chance","B1","Vocabulaire","chance / luck / lucky","Avoir de la chance = be lucky. La chance = luck. Chance = probabilité, occasion (a chance to win).",`
You *have chance*! | are lucky
Good *chance* with your exam! | luck
There's a chance it will rain.
I *had the chance* to find a parking space right away (= j'ai eu de la chance). | was lucky
I had the chance to visit Japan last year.
What a *chance*! | stroke of luck`)
];
// Une correction vide signifie : le passage entre astérisques est en trop.
