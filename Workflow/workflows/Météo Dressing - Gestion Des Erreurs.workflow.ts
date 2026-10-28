const gemini_Flash_Lite_Mod_le = languageModel({ type: '@n8n/n8n-nodes-langchain.lmChatGoogleGemini', version: 1.2, config: { name: 'Gemini Flash Lite - Modèle', parameters: { modelName: 'models/gemini-flash-lite-latest', options: { maxOutputTokens: 800, temperature: 0.2 } }, credentials: { googlePalmApi: newCredential('N8N Servers - GEMINI API', 'kl1i6hEXzOPX75L9') }, position: [1408, 448] } });
const parser_Analyse_De_L_Incident = outputParser({ type: '@n8n/n8n-nodes-langchain.outputParserStructured', version: 1.3, config: { name: 'Parser - Analyse De L\u2019Incident', parameters: { jsonSchemaExample: '{\n  "causeProbable": "Quota Google Sheets dépassé (429)",\n  "prochaineEtape": "Attendre une minute puis rejouer l\u2019exécution",\n  "rejouer": "oui"\n}' }, position: [1568, 448] } });

const error_Trigger = trigger({
  type: 'n8n-nodes-base.errorTrigger',
  version: 1,
  config: { name: 'Error Trigger', position: [720, 224] }
});

const cONFIGURATION = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: { name: 'CONFIGURATION', parameters: { assignments: { assignments: [{ id: '5b9e12b8-c1bf-5601-8d98-e766f83f3b40', name: 'destinataire', type: 'string', value: 'hluong@eugeniaschool.com' }] }, options: {} }, position: [960, 224] }
});

const erreur_Formater_L_Incident = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: { name: 'Erreur - Formater L\u2019Incident', parameters: { assignments: { assignments: [{ id: '17030dd3-b59f-5900-a6e8-ed8e3e3f3e99', name: 'workflowNom', type: 'string', value: expr('{{ $(\'Error Trigger\').first().json.workflow?.name || \'Workflow inconnu\' }}') }, { id: 'a6210fc7-c7c9-563c-be51-a0c44dd31dce', name: 'noeud', type: 'string', value: expr('{{ $(\'Error Trigger\').first().json.execution?.lastNodeExecuted || \'node inconnu\' }}') }, { id: '3d65219c-3f1c-55de-aef4-72227cfac6de', name: 'message', type: 'string', value: expr('{{ String($(\'Error Trigger\').first().json.execution?.error?.message || \'erreur inconnue\').slice(0, 1000) }}') }, { id: '25ddde4a-0ecb-5696-bc50-940c2c9ff4b8', name: 'pile', type: 'string', value: expr('{{ String($(\'Error Trigger\').first().json.execution?.error?.stack || \'\').slice(0, 600) }}') }, { id: '32c144c4-c7fd-535d-b28c-5da17b6a1c80', name: 'executionUrl', type: 'string', value: expr('{{ $(\'Error Trigger\').first().json.execution?.url || \'\' }}') }, { id: 'd1f7001b-f063-5e1d-b84d-5b8a81fa90b2', name: 'executionId', type: 'string', value: expr('{{ String($(\'Error Trigger\').first().json.execution?.id || \'\') }}') }, { id: 'bf2449cc-9fd0-5ec8-ad34-dfc9bf719f6f', name: 'mode', type: 'string', value: expr('{{ $(\'Error Trigger\').first().json.execution?.mode || \'\' }}') }] }, options: {} }, position: [1200, 224] }
});

const gemini_Analyser_La_Cause = node({
  type: '@n8n/n8n-nodes-langchain.chainLlm',
  version: 1.9,
  config: { name: 'Gemini - Analyser La Cause', parameters: { promptType: 'define', text: expr('<inputs>\n<workflow>{{ $json.workflowNom }}</workflow>\n<noeud>{{ $json.noeud }}</noeud>\n<message>{{ $json.message }}</message>\n<pile>{{ $json.pile }}</pile>\n</inputs>'), hasOutputParser: true, messages: { messageValues: [{ message: 'Tu es l\u2019assistant de diagnostic n8n de Mathieu. À partir de l\u2019erreur fournie, réponds en français : cause probable, prochaine étape concrète, et s\u2019il faut rejouer l\u2019exécution (oui pour une panne passagère comme un 429 ou un délai dépassé, non pour un credential ou une donnée invalide, incertain sinon).' }] }, batching: {} }, position: [1440, 224], onError: 'continueRegularOutput', subnodes: { model: gemini_Flash_Lite_Mod_le, outputParser: parser_Analyse_De_L_Incident } }
});

const erreur_Pr_parer_L_Alerte = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: { name: 'Erreur - Préparer L\u2019Alerte', parameters: { assignments: { assignments: [{ id: '565ef2a8-6e50-525c-a6b2-9ec1aa8a6f9b', name: 'analyseIa', type: 'string', value: expr('{{ $json.output ? $json.output.causeProbable + \' — \' + $json.output.prochaineEtape + \' (rejouer : \' + $json.output.rejouer + \')\' : \'analyse IA indisponible\' }}') }, { id: '4bfeb8b4-35db-5887-920b-e45248f53d6f', name: 'sujet', type: 'string', value: expr('{{ \'🔴 Échec — \' + $(\'Erreur - Formater L\u2019Incident\').first().json.workflowNom }}') }, { id: '7702f39b-afc8-5b05-a5e0-c81eab88a272', name: 'html', type: 'string', value: expr('{{ (e => \'<p><b>Workflow</b> : \' + e.workflowNom + \'<br><b>Node</b> : \' + e.noeud + \'<br><b>Erreur</b> : \' + e.message.replace(/&/g, \'&amp;\').replace(/</g, \'&lt;\') + \'<br><b>Heure</b> : \' + $now.toFormat(\'dd/LL/yyyy HH:mm\') + \'</p><p><b>Analyse</b> : \' + ($json.output ? $json.output.causeProbable + \' — \' + $json.output.prochaineEtape + \' (rejouer : \' + $json.output.rejouer + \')\' : \'indisponible\') + \'</p><p><a href="\' + e.executionUrl + \'">Ouvrir l\u2019exécution en échec</a></p><p style="color:#6E6A63">Aucune tenue n\u2019a été inventée : l\u2019exécution s\u2019est arrêtée.</p>\')($(\'Erreur - Formater L\u2019Incident\').first().json) }}') }] }, options: {} }, position: [1680, 224] }
});

const sheets_Journaliser_L_Incident = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.5,
  config: { name: 'Sheets - Journaliser L\u2019Incident', parameters: { operation: 'append', documentId: { __rl: true, mode: 'list', value: '1d2A0nSkN_bo6gbLPtxjbbVct8MkUUHxCjhfZRL1J-gI', cachedResultName: 'TOOBOO - Meteo Dressing - Uniqlo Homme smart casual', cachedResultUrl: 'https://docs.google.com/spreadsheets/d/1d2A0nSkN_bo6gbLPtxjbbVct8MkUUHxCjhfZRL1J-gI/edit' }, sheetName: { __rl: true, mode: 'name', value: 'LOGS' }, columns: { mappingMode: 'defineBelow', value: { execution_id: expr('{{ $(\'Erreur - Formater L\u2019Incident\').first().json.executionId }}'), date_execution: expr('{{ $now.setZone(\'Europe/Paris\').toFormat(\'yyyy-LL-dd HH:mm:ss\') }}'), ville: '', source_meteo: '', statut: expr('{{ \'erreur : \' + $(\'Erreur - Formater L\u2019Incident\').first().json.workflowNom }}'), tenue_generee: '', raison_rejet: '', erreur: expr('{{ $(\'Erreur - Formater L\u2019Incident\').first().json.noeud + \' : \' + $(\'Erreur - Formater L\u2019Incident\').first().json.message + \' — \' + $(\'Erreur - Formater L\u2019Incident\').first().json.executionUrl + \' — \' + $json.analyseIa }}') }, matchingColumns: [], schema: [{ id: 'execution_id', displayName: 'execution_id', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true, removed: false }, { id: 'date_execution', displayName: 'date_execution', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true, removed: false }, { id: 'ville', displayName: 'ville', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true, removed: false }, { id: 'source_meteo', displayName: 'source_meteo', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true, removed: false }, { id: 'statut', displayName: 'statut', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true, removed: false }, { id: 'tenue_generee', displayName: 'tenue_generee', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true, removed: false }, { id: 'raison_rejet', displayName: 'raison_rejet', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true, removed: false }, { id: 'erreur', displayName: 'erreur', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true, removed: false }], attemptToConvertTypes: false, convertFieldsToString: false }, options: { cellFormat: 'RAW' } }, credentials: { googleSheetsOAuth2Api: newCredential('Google Sheets account', '362MAbAVt6simaTE') }, position: [1920, 224], retryOnFail: true, maxTries: 3, waitBetweenTries: 3000, onError: 'continueRegularOutput' }
});

const gmail_Alerter_Hoang_Kim = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.1,
  config: { name: 'Gmail - Alerter Hoang-Kim', parameters: { sendTo: expr('{{ $(\'CONFIGURATION\').first().json.destinataire }}'), subject: expr('{{ $(\'Erreur - Préparer L\u2019Alerte\').first().json.sujet }}'), message: expr('{{ $(\'Erreur - Préparer L\u2019Alerte\').first().json.html }}'), options: { appendAttribution: false, senderName: 'Météo Dressing' } }, credentials: { gmailOAuth2: newCredential('Gmail account', 'k9UQKNpjuX3Ku8dT') }, position: [2160, 224], webhookId: '77fc65d5-24a2-5b02-a336-74019ba992de', retryOnFail: true, maxTries: 3, waitBetweenTries: 5000 }
});

const wf = workflow('tQthSNUwuaR5fcMQ', 'Météo Dressing - Gestion Des Erreurs', { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: true });

export default wf
  .add(error_Trigger)
  .to(cONFIGURATION)
  .to(erreur_Formater_L_Incident)
  .to(gemini_Analyser_La_Cause)
  .to(erreur_Pr_parer_L_Alerte)
  .to(sheets_Journaliser_L_Incident)
  .to(gmail_Alerter_Hoang_Kim)
  .add(sticky('# Météo Dressing - Gestion Des Erreurs\nError Workflow des 4 autres workflows (Settings → Error Workflow). Version allégée du template **20499** de Lucas Peyrin : incident journalisé dans l\'onglet **LOGS**, cause analysée par Gemini Flash-Lite, alerte Gmail avec le **lien direct vers l\'exécution** (`execution.url`).', [], { name: 'Note 1', color: '#42032C', width: 640, height: 330, position: [0, 64] }))
  .add(sticky('## Alerte', [error_Trigger, cONFIGURATION, erreur_Formater_L_Incident, gemini_Analyser_La_Cause, gemini_Flash_Lite_Mod_le, parser_Analyse_De_L_Incident, erreur_Pr_parer_L_Alerte, sheets_Journaliser_L_Incident, gmail_Alerter_Hoang_Kim], { name: 'Note 3', color: 7, width: 1650, height: 584, position: [672, 64] }))