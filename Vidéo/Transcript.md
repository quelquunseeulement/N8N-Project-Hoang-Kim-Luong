# Transcript — Météo Dressing

Présentation vidéo du projet n8n **Météo Dressing** (5 min 54).

[Regarder la vidéo](presentation-meteo-dressing.mp4) · [Retour au README](../README.md)

---

Hello Lucas, alors c'est Wankim, aujourd'hui je te présente mon petit projet N8N. Alors déjà, je ne sais pas si tu connais Tooboo, mais c'est un peu l'idée derrière mon projet. Tooboo, c'est ce petit singe qui va te prédire la météo et du coup te trouver une tenue en fonction de la météo.

C'est lui qui dictait si on sortait en doudoune ou pas. Là, j'ai à peu près fait la même chose, mais du coup, juste ici, comme tu peux le voir, j'ai reçu des mails tous les jours depuis qu'on ne t'a pas eu en fait. Et notamment aujourd'hui à 7h08.

Donc là, il y a les degrés ressentis, ensuite ça te propose 3 tenues parce que j'aime quand même avoir le choix de mes tenues. Et là, je vais prendre celui-là parce que c'est le rempart grand confort et je trouve qu'il fait hyper froid en ce moment. Donc je choisis cette tenue.

C'est déjà enregistré, j'avoue, parce que j'ai déjà validé ce matin. J'essaie d'enregistrer, mais j'ai oublié de mettre mon petit micro. Donc là, je vais écrire parfait.

J'évalue la tenue et du coup, pour faire ce petit outil, j'ai fait ce petit Google Sheet avec du coup toutes les références. Parce que c'est vrai que comment le styliste, il ferait pour me composer une tenue s'il n'a pas toute ma garde-robe à disposition. Là, c'est la même chose.

Sauf que là, on va indiquer du coup la saison, température minimum, maximum, si c'est adapté à la pluie ou le vent. Là, l'image URL parce que c'est quand même moins sexy s'il n'y a pas les images. Donc voilà.

Ensuite, je te montre mes petits workflows. Donc là, on va dans projet parce que tu nous as bien appris à bien ranger. Donc tout d'abord, tu as l'orchestrateur.

En fait, l'orchestrateur, ce sera celui qui va appeler tous les petits workflows. Parce que du coup, mon workflow se décompose en plusieurs étapes. Tout d'abord, tu as la prévision météo.

Tu as la lecture du Google Sheet. Tu as le trigger. Le trigger qui est planifié à 7h ou manuel pour tester le workflow.

Parce que j'ai dû le tester. Il lit le Google Sheet. Ensuite, prend le contexte et la météo.

Te génère une vidéo. Évidemment, on a toujours une petite boucle en cas d'erreur. Donc là, s'il n'y a aucune tenue composée ou ici, si la météo n'est pas récupérée.

Ensuite, ça valide et ça l'inscrit dans ton journal. Parce qu'évidemment, on ne veut pas qu'une tenue soit reproposée tous les jours dans la semaine. Le but, c'est d'avoir des tenues quand même assez différentes.

J'ai limité à une même tenue par semaine et trois fois le même pantalon. Je te montre aussi comment est composée Miss Météo. Ici, ça le reprend avec l'API OpenMétéo.

Ça résume la journée et ça te retourne le résultat. Ensuite, tu as le styliste. La génération de tenues qui va rassembler toutes les entrées.

Ensuite, le maître dans Gemini va te retourner les tenues qu'il aura composées. Là, c'est un peu comme le videur de boîte de nuit. Par exemple, si tu as remis la même tenue, ça va le refuser à l'entrée.

Si la combinaison n'est pas bonne, il va te le refuser, etc. Après, tu as la gestion des erreurs au cas où. Je te laisse quand même profiter de ce beau mail qui a été parfaitement composé.

Si jamais tu connais quelqu'un à Uniqlo, n'hésite surtout pas. Sinon, retour sur l'expérience, je trouvais que tu étais quand même assez accessible. Lorsqu'on a des problèmes sur le workflow, tu viens nous aider.

En tout cas, on n'a pas peur de venir te voir. Mais j'avoue qu'il manquerait un peu plus de structure. Là, par exemple, je trouve ça assez dommage que tu n'aies pas fait un format.

Par exemple, les 10 astuces que tu aurais aimé savoir, ou bien les 5 erreurs assez fréquentes chez les débutants. Avoir un format un peu plus structuré, un peu plus cool à entendre, je pense que ça aurait été un peu mieux. Par exemple, je sais que tu accompagnes les élèves à utiliser l'IA, par exemple, pour gérer les erreurs, etc.

Moi, c'est vrai que je suis assez à l'aise, mais il y a beaucoup de gens dans la classe qui le sont un peu moins. Donc, peut-être essayer un peu plus de les accompagner. Après, c'est vrai que c'est un peu plus relou, parce que tu as une certaine disparité de niveau, ce que je peux comprendre.

Mais voilà, c'est mon petit retour sur l'expérience. En tout cas, c'était assez sympa. Et comme tu peux le voir, j'aime aussi faire des workflows, parce que je peux apporter une certaine créativité.

Comme tu peux le voir, je pense que je suis un peu le meilleur workflow, sans vouloir me jeter des roses. Mais petit mot de la fin, je pense que ce serait habille-toi bien, parce que maintenant, tu n'as plus aucune excuse avec mon workflow. Et en plus, si tu veux, je pourrais te donner le Google Sheet.

Et je sais que les hommes, ça tourne avec Uniqlo, Jules ou Célio. Donc tu pourras mettre tes propres références, tu pourras les prendre en photo et les mettre dans le petit Google Sheet. Et voilà, tout est à toi.

Donc je te dis ciao !
