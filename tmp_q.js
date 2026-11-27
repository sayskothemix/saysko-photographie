
const QUIZ=[
{t:"Réglages de base",q:"Dans le module <em>Développement</em>, le curseur « Exposition » à +1,00 EV signifie…",
 c:["+1 stop de lumière en plus","Une ouverture plus grande","Un ISO doublé","Un cadrage zoomé"],
 b:0,
 e:"EV = Exposure Value (valeur d'exposition). +1 EV double la quantité de lumière, soit environ 1 stop. En RAW, on peut descendre à -4/-5 EV sur les hautes lumières sans perdre le ciel."},
{t:"Réglages de base",q:"Vous voulez une image <em>plus contrastée</em> sans toucher aux tons extrêmes. Quel curseur ?",
 c:["Exposition","Contraste","Température","Netteté"],
 b:1,
 e:"Le contraste étale les tons moyens : les ombres foncent, les hautes lumières s'éclaircissent. Attention à ne pas confondre avec la « clarté » (Texture/Clarté), qui agit sur les détails locaux."},
{t:"Réglages de base",q:"La <em>balance des blancs</em> se règle dans Lightroom avec…",
 c:["Uniquement la pipette Température","L'outil pipette (« Échantillonner une couleur ») sur une zone neutre + Température/Teinte","Le curseur Vibrance","Impossible en RAW"],
 b:1,
 e:"La pipette sur un gris neutre ou du blanc est la méthode la plus fiable. Température (bleu↔orange) et Teinte (vert↔magenta) affinent ensuite. Sur RAW, tout est modifiable sans perte."},
{t:"Histogramme & courbes",q:"Sur l'histogramme, vos <em>ombres sont collées au bord gauche</em>. Que s'est-il passé ?",
 c:["Image trop claire","Détails perdus dans les zones sombres (sous-exposition)","Problème de balance des blancs","Le RAW est corrompu"],
 b:1,
 e:"Les tons sombres ont été écrasés contre le bord gauche : des détails sont définitivement perdus dans les ombres. En RAW, remontez l'exposition ou utilisez les curseurs Ombrage/Noirs — la récupération est souvent possible."},
{t:"Histogramme & courbes",q:"L'outil <em>Courbes paramétriques</em> (point RGB) sert surtout à…",
 c:["Changer la balance des blancs","Remonter les ombres et baisser les hautes lumières indépendamment","Ajouter du bruit","Créer un recadrage"],
 b:1,
 e:"En cliquant sur la diagonale : tirer le point « Ombres » vers le haut éclaircit les ombres, « Lumières » vers le bas assombrit les hautes lumières. C'est l'outil de choix pour un look « aplati » ou « matt »."},
{t:"HSL & couleur",q:"Vous voulez un ciel <em>plus bleu</em> sans changer le reste de l'image. Quel panneau ?",
 c:["Courbes de tons","HSL — teinte/ saturation des Bleus uniquement","Correcteur sélection de couleur global","Vibrance +50"],
 b:1,
 e:"Dans l'onglet HSL, sélectionnez « Bleu » et montez la Saturation (ou ajustez la Teinte vers le bleu pur). Les curseurs par plage de couleurs ciblent une famille sans toucher aux autres tons."},
{t:"HSL & couleur",q:"L'outil <em>Correcteur sélection de couleur</em> (color grading) sert à…",
 c:["Supprimer les yeux rouges","Ajouter une couleur à une plage de luminosité (ex. ombres chaudes, lumières froides)","Recadrer la photo","Appliquer un préréglage global"],
 b:1,
 e:"C'est le « color grading » : vous choisissez une plage (ombres, tons moyens, hautes lumières) et lui appliquez une teinte. Le rendu « cinéma » vient souvent de là : ombres bleutées + lumières dorées."},
{t:"Masques & retouche locale",q:"Vous voulez éclaircir <em>uniquement le visage</em>, pas le fond. Outil ?",
 c:["Vignettage post-crop","Pinceau de retouche (Ajustement local)","Recadrage","Filtre gradué"],
 b:1,
 e:"Le pinceau (« A ») permet de peindre un masque précis : vous augmentez l'exposition locale sur le visage. Astuce : mode « Superposition » (Y) pour voir le masque en rouge."},
{t:"Masques & retouche locale",q:"Un <em>filtre gradué</em> est idéal pour…",
 c:["Retoucher les boutons d'une chemise","Assombrir un ciel trop clair en partant de l'horizon","Ajouter du flou global","Changer la focale"],
 b:1,
 e:"Le dégradé va du foncé vers le transparent : parfait pour un ciel, une mer ou une zone à harmoniser. Glissez de haut en bas (ou l'inverse) et ajustez l'exposition dans le panneau."},
{t:"Masques & retouche locale",q:"Le <em>masque par plage de couleurs</em> (ex. sélectionner les rouges) permet de…",
 c:["Nettoyer les capteurs","Retoucher une couleur précise (ex. robe rouge, ciel) sans affecter le reste","Gérer les collections","Exporter en TIFF"],
 b:1,
 e:"Vous cliquez sur la couleur dans l'image et Lightroom crée un masque limité à cette plage. Incontournable pour corriger une robe, une enseigne ou un élément coloré isolé."},
{t:"Organisation",q:"La différence entre une <em>collection</em> et un <em>album</em> dans Lightroom :",
 c:["Aucune — ce sont deux noms du même dossier","Une collection est une vue virtuelle (même photo dans plusieurs), un album copie les fichiers","L'album est automatique, la collection manuelle","La collection marche seulement en Cloud"],
 b:1,
 e:"Une collection n'ajoute pas de fichier : la même photo peut être dans 10 collections sans dupliquer. Un album, lui, copie les fichiers physiques sur le disque."},
{t:"Organisation",q:"Votre <em>catalogue Lightroom</em> contient :",
 c:["Les photos elles-mêmes","Les réglages, collections et aperçu — les fichiers restent à leur place","Uniquement les exports JPEG","Les RAW supprimés de l'appareil"],
 b:1,
 e:"Lightroom Classic stocke les réglages dans le catalogue (.lrcat) ; les RAW restent sur votre disque (G:\\STOKAGE IMAGES…). C'est pour ça qu'un catalogue doit être sauvegardé ET que les photos ne doivent pas bouger sans « Rechercher le dossier manquant »."},
{t:"Organisation",q:"La <em>Collection rapide</em> (« Quick Collection ») sert à…",
 c:["Publier sur Instagram","Assembler temporairement des photos pour un export ou une sélection","Stocker les favorites","Sauvegarder le catalogue"],
 b:1,
 e:"Vous y ajoutez des photos d'un clic (B), vous la nommez, puis vous exportez ou transformez en collection. C'est l'outil de tri rapide — parfait pour préparer vos 9 photos Instagram."},
{t:"Export",q:"Pour Instagram, le format et les dimensions idéaux sont…",
 c:["RAW 16 bits","JPEG sRGB, 1080×1350 (4:5)","PNG 300 dpi","TIFF LZW"],
 b:1,
 e:"Instagram convertit tout en JPEG de toute façon : exportez directement en JPEG sRGB qualité 85-90, dimensions adaptées au format voulu (4:5 = 1080×1350, carré = 1080×1080)."},
{t:"Export",q:"Dans l'export Lightroom, le réglage <em>« Redimensionner »</em> doit être…",
 c:["Jamais coché","Coché avec « Ne pas agrandir » pour Instagram","Toujours sur 100%","Uniquement pour les TIFF"],
 b:1,
 e:"Pour le web et les réseaux, on réduit : cochez « Ne pas agrandir les images petites » pour ne pas pixeliser une petite source. Les exports « pour archive » restent en pleine résolution."},
{t:"Export",q:"Votre export JPEG a des couleurs <em>bizarres sur téléphone</em> mais correctes sur écran. Cause probable ?",
 c:["La qualité trop basse","Mauvais espace colorimétrique (sRGB non coché)","Le RAW est trop grand","Lightroom Classic est buggé"],
 b:1,
 e:"Les écrans utilisent sRGB : si l'export part en Adobe RGB ou ProPhoto, les couleurs dérivent sur mobile. Dans l'export : Espace colorimétrique → sRGB, toujours."},
{t:"Workflow",q:"Vous corrigez 50 photos avec le même style. L'outil pour <em>copier les réglages</em> d'une photo à d'autres :",
 c:["Égaliser","Synchroniser les paramètres (ou « Copier les paramètres de développement »)","Stack","Snapshots"],
 b:1,
 e:"Sélectionnez la photo source + les cibles, clic droit → « Paramètres de développement » → « Copier », puis « Coller ». Ou « Synchroniser » pour tout faire en une fenêtre. Pratique pour un shooting cohérent."},
{t:"Workflow",q:"Les <em>snapshots</em> dans Lightroom servent à…",
 c:["Sauvegarder des versions de retouche d'une même photo","Exporter des séries","Créer des albums","Nettoyer le catalogue"],
 b:0,
 e:"Un snapshot enregistre l'état complet des réglages à un instant T. « Avant retouche », « Version sombre », « Export final »… vous pouvez y revenir sans tout refaire."},
{t:"Workflow",q:"Vous avez 30 prises de vue quasi identiques d'un même instant. L'outil pour les <em>regrouper et n'en garder qu'une</em> :",
 c:["L'empilement (Stack)","La Collection rapide","Le filtre par mots-clés","L'export en lots"],
 b:0,
 e:"Ctrl+clic (ou Cmd) pour sélectionner les prises → clic droit → « Empiler » (ou Cmd+R). Toutes les variantes se replient sous la meilleure : vous gagnez de la place visuelle et gagnez du temps au tri."},
{t:"Workflow",q:"La <em>touche Y</em> (ou « Avant/Après ») dans Lightroom permet de…",
 c:["Exporter en JPEG","Comparer instantanément la photo retouchée avec l'original","Zoomer à 100%","Basculer les collections"],
 b:1,
 e:"Y affiche l'avant/après en temps réel — indispensable pour vérifier qu'on n'en fait pas trop (sur-retouche, halos). Variante : « \\ » pour un partage avant/après côte à côte."}
];

let i=0,score=0,serie=0,maxSerie=0,parTheme={};
const $=id=>document.getElementById(id);

function melanger(a){for(let k=a.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[a[k],a[j]]=[a[j],a[k]]}return a}
function ordre(){const idx=QUIZ.map((_,k)=>k);return melanger(idx)}
let file=ordre();

function afficherRecord(){
  try{const r=JSON.parse(localStorage.getItem('quizLightroomRecord')||'null');
    if(r)$('record').textContent='Meilleur score : '+r.score+'/'+r.total+' — '+r.date;
  }catch(e){}
}
function sauvegarder(score){
  try{
    const r=JSON.parse(localStorage.getItem('quizLightroomRecord')||'null');
    if(!r||score>r.score)localStorage.setItem('quizLightroomRecord',JSON.stringify({score:score,total:QUIZ.length,date:new Date().toLocaleDateString('fr-FR')}));
  }catch(e){}
}

function commencer(){
  file=ordre();i=0;score=0;serie=0;maxSerie=0;parTheme={};
  $('ecranDebut').style.display='none';$('ecranResultat').style.display='none';$('ecranQuiz').style.display='block';
  question();
}
function retourDebut(){$('ecranResultat').style.display='none';$('ecranQuiz').style.display='none';$('ecranDebut').style.display='block';afficherRecord()}

function question(){
  const q=QUIZ[file[i]];
  $('theme').textContent=q.t;
  $('qnum').textContent='Question '+(i+1)+' / '+QUIZ.length;
  $('barre').style.width=(i/QUIZ.length*100)+'%';
  $('question').innerHTML=q.q;
  $('serie').textContent=serie>1?('Série : '+serie):'';
  $('feedback').className='feedback';$('suite').className='suite';
  $('choix').innerHTML='';
  const ordreC=melanger(q.c.map((txt,k)=>({txt,k})));
  ordreC.forEach(o=>{
    const b=document.createElement('button');
    b.innerHTML=o.txt;
    b.onclick=()=>repondre(b,o.k===q.b,q);
    $('choix').appendChild(b);
  });
}
function repondre(btn,ok,q){
  [...$('choix').children].forEach(b=>{b.disabled=true;if(b.innerHTML===q.c[q.b])b.classList.add('bon')});
  if(!ok)btn.classList.add('mauvais');
  if(ok){score++;serie++;maxSerie=Math.max(maxSerie,serie)}else serie=0;
  parTheme[q.t]=parTheme[q.t]||{ok:0,tot:0};parTheme[q.t].tot++;if(ok)parTheme[q.t].ok++;
  $('fbTitre').textContent=ok?'Correct':'Raté — la bonne réponse : « '+q.c[q.b]+' »';
  $('fbTexte').textContent=q.e;
  $('feedback').className='feedback visible';
  $('suite').className='suite visible';
  $('btnSuite').textContent=i<QUIZ.length-1?'Question suivante':'Voir le résultat';
}
function suivante(){i++;if(i>=QUIZ.length)resultat();else question()}

function resultat(){
  $('ecranQuiz').style.display='none';$('ecranResultat').style.display='block';
  $('barre').style.width='100%';
  const p=score/QUIZ.length*100;
  $('scoreFinal').textContent=score+'/'+QUIZ.length;
  let niv,com;
  if(p>=90){niv='Niveau Or — Expert Lightroom';com='Impressionnant : vous maîtrisez les réglages, les masques et l\'export. Vous pouvez viser la productivité (presets, copies synchronisées, exports automatisés).'}
  else if(p>=75){niv='Niveau Argent — Retouche autonome';com='Très bon niveau : les bases sont solides. Revoyez les thèmes où vous avez hésité — le quiz est rejouable à l\'infini.'}
  else if(p>=55){niv='Niveau Bronze — En bonne voie';com='Vous avez les instincts, mais certains réflexes manquent encore. Refaites le quiz dans une semaine après avoir relu les explications.'}
  else{niv='Niveau Explorateur — Les bases d\'abord';com='Normal au début : Lightroom se apprend. Commencez par le panneau Développement et les exports JPEG sRGB, puis rejouez ce quiz.'}
  $('niveau').textContent=niv;$('commentaire').textContent=com;
  const themes=Object.entries(parTheme).map(([t,v])=>({t,pct:v.ok/v.tot*100}));
  const badges=[
    {txt:'Réglages de base parfaits',ok:themes.find(x=>x.t==='Réglages de base')&&themes.find(x=>x.t==='Réglages de base').pct===100},
    {txt:'Maîtrise des masques',ok:themes.find(x=>x.t==='Masques & retouche locale')&&themes.find(x=>x.t==='Masques & retouche locale').pct>=75},
    {txt:'Export sans faute',ok:themes.find(x=>x.t==='Export')&&themes.find(x=>x.t==='Export').pct===100},
    {txt:'Série de 5+ bonnes réponses',ok:maxSerie>=5},
    {txt:'Organisation solide',ok:themes.find(x=>x.t==='Organisation')&&themes.find(x=>x.t==='Organisation').pct>=75},
  ];
  $('badges').innerHTML=badges.map(b=>'<span class="'+(b.ok?'badge-obtenu':'badge-verrouille')+'">'+(b.ok?'✓ ':'')+b.txt+'</span>').join('');
  sauvegarder(score);afficherRecord();
}

afficherRecord();
