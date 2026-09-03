import fs from 'fs';
import path from 'path';

export interface SubmissionRecord {
  id: string;
  timestamp: string;
  user_affiliation: string;
  age_bracket: string;
  age: number;
  sex: string;
  eligible_vaccines: string[];
  reasons_by_vaccine: Record<string, string[]>;
  facts: Record<string, any>;
  awareness_feedback?: 'SIM' | 'NAO' | 'PARCIAL' | string;
  card_updated_feedback?: 'SIM' | 'NAO' | 'NAO_SEI' | string;
}

export interface AnalyticsSummary {
  totalRespondents: number;
  byAffiliation: {
    dumas: number;
    itapevi: number;
    forcaVendas: number;
    pfizer?: number;
  };
  byAgeBracket: Record<string, number>;
  bySex: {
    feminino: number;
    masculino: number;
    naoInformar: number;
    femininoPercentage: number;
    masculinoPercentage: number;
    naoInformarPercentage: number;
  };
  vaccineStats: {
    COVID_19: { count: number; percentage: number };
    VSR: { count: number; percentage: number };
    PNEUMO_20: { count: number; percentage: number };
  };
  awarenessStats: {
    sim: number;
    nao: number;
    parcial: number;
    simPercentage: number;
    naoPercentage: number;
    parcialPercentage: number;
    totalResponses: number;
  };
  topConditions: { name: string; count: number; percentage: number }[];
  recentSubmissions: {
    id: string;
    timestamp: string;
    user_affiliation: string;
    age_bracket: string;
    sex: string;
    vaccines: string[];
    awareness_feedback?: string;
  }[];
}

const IS_VERCEL = !!process.env.VERCEL;
const DATA_DIR = IS_VERCEL ? '/tmp' : path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'submissions.json');
const BUNDLED_FILE_PATH = path.join(process.cwd(), 'data', 'submissions.json');

// Cache em memória para ambientes serverless
declare global {
  var __TRIVAX_SUBMISSIONS__: SubmissionRecord[] | undefined;
}

function ensureFileExists() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FILE_PATH)) {
      if (IS_VERCEL && fs.existsSync(BUNDLED_FILE_PATH)) {
        try {
          const content = fs.readFileSync(BUNDLED_FILE_PATH, 'utf-8');
          fs.writeFileSync(FILE_PATH, content.replace(/^\uFEFF/, '').trim() || '[]', 'utf-8');
          return;
        } catch {}
      }
      fs.writeFileSync(FILE_PATH, '[]', 'utf-8');
    }
  } catch (err) {
    console.warn('ensureFileExists warning:', err);
  }
}

function readSubmissions(): SubmissionRecord[] {
  try {
    ensureFileExists();
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, 'utf-8');
      const clean = (raw || '').replace(/^\uFEFF/, '').trim();
      if (clean) {
        const parsed = JSON.parse(clean);
        if (Array.isArray(parsed)) {
          globalThis.__TRIVAX_SUBMISSIONS__ = parsed;
          return parsed;
        }
      }
    }
  } catch (err) {
    console.error('Erro ao ler submissions.json:', err);
  }

  return globalThis.__TRIVAX_SUBMISSIONS__ || [];
}

function writeSubmissions(list: SubmissionRecord[]) {
  globalThis.__TRIVAX_SUBMISSIONS__ = list;
  try {
    ensureFileExists();
    fs.writeFileSync(FILE_PATH, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Erro ao gravar submissions.json:', err);
  }
}

export function saveSubmission(data: Omit<SubmissionRecord, 'id' | 'timestamp'>): SubmissionRecord {
  const list = readSubmissions();

  const record: SubmissionRecord = {
    id: 'sub_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    timestamp: new Date().toISOString(),
    ...data,
  };

  list.unshift(record); // adiciona no início
  writeSubmissions(list);
  return record;
}

export function updateSubmissionFeedback(id: string, feedback?: string, cardUpdatedFeedback?: string): boolean {
  const list = readSubmissions();

  const index = list.findIndex((item) => item.id === id);
  if (index !== -1) {
    if (feedback !== undefined) list[index].awareness_feedback = feedback;
    if (cardUpdatedFeedback !== undefined) list[index].card_updated_feedback = cardUpdatedFeedback;
    writeSubmissions(list);
    return true;
  }
  return false;
}

export function getAllSubmissions(affiliationFilter?: string): SubmissionRecord[] {
  const list = readSubmissions();

  if (affiliationFilter && affiliationFilter !== 'ALL') {
    if (affiliationFilter === 'DUMAS') {
      return list.filter((r) => r.user_affiliation === 'DUMAS' || r.user_affiliation === 'PFIZER');
    }
    return list.filter((r) => r.user_affiliation === affiliationFilter);
  }
  return list;
}

export function getAnalytics(affiliationFilter?: string): AnalyticsSummary {
  const records = getAllSubmissions(affiliationFilter);
  const total = records.length;

  const byAffiliation = { dumas: 0, itapevi: 0, forcaVendas: 0, pfizer: 0 };
  const byAgeBracket: Record<string, number> = {
    '18_49': 0,
    '50_59': 0,
    '60_74': 0,
    '75_plus': 0,
  };

  let femininoCount = 0;
  let masculinoCount = 0;
  let naoInformarCount = 0;

  let covidCount = 0;
  let vsrCount = 0;
  let pneumoCount = 0;

  let awarenessSim = 0;
  let awarenessNao = 0;
  let awarenessParcial = 0;

  const conditionCounts: Record<string, number> = {};

  const conditionLabels: Record<string, string> = {
    has_diabetes: 'Diabetes Mellitus',
    has_asthma: 'Asma',
    has_copd: 'DPOC / Enfisema',
    has_heart_failure: 'Insuficiência Cardíaca',
    has_coronary_disease: 'Doença Coronariana',
    has_chronic_kidney_disease: 'Doença Renal Crônica',
    has_chronic_liver_disease: 'Doença Hepática',
    has_cancer: 'Câncer / Imunossupressão',
    has_morbid_obesity_bmi_40: 'Obesidade Grau 3 (IMC ≥ 40)',
    is_smoker: 'Tabagismo Ativo',
    has_alcoholism: 'Alcoolismo',
    is_pregnant: 'Gestante',
    is_health_worker: 'Trabalhador da Saúde',
    has_clinical_frailty: 'Fragilidade Clínica',
    has_cochlear_implant: 'Implante Coclear',
    has_asplenia: 'Ausência ou disfunção do Baço',
    has_csf_leak: 'Fístula Liquórica',
  };

  for (const r of records) {
    if (r.user_affiliation === 'DUMAS' || r.user_affiliation === 'PFIZER') {
      byAffiliation.dumas++;
      byAffiliation.pfizer++;
    } else if (r.user_affiliation === 'ITAPEVI') {
      byAffiliation.itapevi++;
    } else if (r.user_affiliation === 'FORCA_DE_VENDAS') {
      byAffiliation.forcaVendas++;
    }

    if (r.age_bracket && byAgeBracket[r.age_bracket] !== undefined) {
      byAgeBracket[r.age_bracket]++;
    }

    if (r.sex === 'FEMININO') femininoCount++;
    else if (r.sex === 'MASCULINO') masculinoCount++;
    else naoInformarCount++;

    if (r.eligible_vaccines.includes('COVID_19')) covidCount++;
    if (r.eligible_vaccines.includes('VSR')) vsrCount++;
    if (r.eligible_vaccines.includes('PNEUMO_20')) pneumoCount++;

    // Estatísticas de Conhecimento Prévio
    if (r.awareness_feedback === 'SIM') awarenessSim++;
    if (r.awareness_feedback === 'NAO') awarenessNao++;
    if (r.awareness_feedback === 'PARCIAL') awarenessParcial++;

    // Contagem de comorbidades
    for (const [factKey, val] of Object.entries(r.facts || {})) {
      if (val === true && conditionLabels[factKey]) {
        conditionCounts[factKey] = (conditionCounts[factKey] || 0) + 1;
      }
    }
  }

  const bySex = {
    feminino: femininoCount,
    masculino: masculinoCount,
    naoInformar: naoInformarCount,
    femininoPercentage: total > 0 ? Math.round((femininoCount / total) * 100) : 0,
    masculinoPercentage: total > 0 ? Math.round((masculinoCount / total) * 100) : 0,
    naoInformarPercentage: total > 0 ? Math.round((naoInformarCount / total) * 100) : 0,
  };

  const totalFeedback = awarenessSim + awarenessNao + awarenessParcial;

  const topConditions = Object.entries(conditionCounts)
    .map(([key, count]) => ({
      name: conditionLabels[key] || key,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const recentSubmissions = records.slice(0, 30).map((r) => ({
    id: r.id,
    timestamp: r.timestamp,
    user_affiliation: r.user_affiliation,
    age_bracket: r.age_bracket,
    sex: r.sex,
    vaccines: r.eligible_vaccines,
    awareness_feedback: r.awareness_feedback,
  }));

  return {
    totalRespondents: total,
    byAffiliation,
    byAgeBracket,
    bySex,
    vaccineStats: {
      COVID_19: {
        count: covidCount,
        percentage: total > 0 ? Math.round((covidCount / total) * 100) : 0,
      },
      VSR: {
        count: vsrCount,
        percentage: total > 0 ? Math.round((vsrCount / total) * 100) : 0,
      },
      PNEUMO_20: {
        count: pneumoCount,
        percentage: total > 0 ? Math.round((pneumoCount / total) * 100) : 0,
      },
    },
    awarenessStats: {
      sim: awarenessSim,
      nao: awarenessNao,
      parcial: awarenessParcial,
      simPercentage: totalFeedback > 0 ? Math.round((awarenessSim / totalFeedback) * 100) : 0,
      naoPercentage: totalFeedback > 0 ? Math.round((awarenessNao / totalFeedback) * 100) : 0,
      parcialPercentage: totalFeedback > 0 ? Math.round((awarenessParcial / totalFeedback) * 100) : 0,
      totalResponses: totalFeedback,
    },
    topConditions,
    recentSubmissions,
  };
}

/**
 * Helper para formatar valores booleanos em Sim / Não / Não se aplica
 */
function formatBool(val: any, notApplicable = false): string {
  if (notApplicable) return 'Não se aplica';
  if (val === true) return 'Sim';
  if (val === false) return 'Não';
  return 'Não';
}

/**
 * Escapa células para CSV com delimitador ponto e vírgula (padrão Excel Brasil)
 */
function escapeCsv(str: any): string {
  if (str === null || str === undefined) return '""';
  const text = String(str).replace(/"/g, '""');
  return `"${text}"`;
}

export function exportSubmissionsToCSV(affiliationFilter?: string): string {
  const records = getAllSubmissions(affiliationFilter);

  // CABEÇALHO COMPLETO SEPARADO POR PÁGINAS E COLUNAS
  const headers = [
    // METADADOS
    'ID da Avaliação',
    'Data e Hora',

    // PÁGINA 1: IDENTIFICAÇÃO INICIAL
    '[Etapa 1] Unidade / Vínculo',
    '[Etapa 1] Faixa Etária',
    '[Etapa 1] Sexo',

    // PÁGINA 2: SAÚDE DA MULHER (GESTANTE / PUÉRPERA)
    '[Etapa 2 - Mulher] Gestante',
    '[Etapa 2 - Mulher] Idade Gestacional (a partir de 24 semanas)',
    '[Etapa 2 - Mulher] Puérpera (até 45 dias pós-parto)',

    // PÁGINA 3: GRUPOS ESPECIAIS & HÁBITOS DE VIDA
    '[Etapa 3 - Hábitos] Trabalhador da Saúde',
    '[Etapa 3 - Hábitos] Tabagismo Ativo',
    '[Etapa 3 - Hábitos] Alcoolismo',
    '[Etapa 3 - Hábitos] Fragilidade Clínica / Doença Neurológica',

    // PÁGINA 4: CONDIÇÕES CARDIORRESPIRATÓRIAS
    '[Etapa 4 - Cardiorresp] Asma Moderada a Grave',
    '[Etapa 4 - Cardiorresp] DPOC / Doença Pulmonar Crônica',
    '[Etapa 4 - Cardiorresp] Insuficiência Cardíaca',
    '[Etapa 4 - Cardiorresp] Doença Coronariana',

    // PÁGINA 5: CONDIÇÕES METABÓLICAS, RENAIS E HEPÁTICAS
    '[Etapa 5 - Metabólico/Renal] Diabetes Mellitus',
    '[Etapa 5 - Metabólico/Renal] Doença Renal Crônica',
    '[Etapa 5 - Metabólico/Renal] Doença Hepática Crônica',
    '[Etapa 5 - Metabólico/Renal] Obesidade Grau 3 (IMC >= 40)',

    // PÁGINA 6: IMUNOSSUPRESSÃO E OUTRAS CONDIÇÕES
    '[Etapa 6 - Imunossupressão] Imunossupressão / Câncer / Quimioterapia',
    '[Etapa 6 - Imunossupressão] Ausência ou Disfunção do Baço (Asplenia)',
    '[Etapa 6 - Outras] Implante Coclear',
    '[Etapa 6 - Outras] Fístula Liquórica',

    // RESULTADOS DO MOTOR CLÍNICO TRIVAX
    '[Resultado] COVID-19 Indicada?',
    '[Resultado] COVID-19 - Motivos Técnicos',
    '[Resultado] VSR Indicada?',
    '[Resultado] VSR - Motivos Técnicos',
    '[Resultado] Pneumocócica 20 Indicada?',
    '[Resultado] Pneumocócica 20 - Motivos Técnicos',
    '[Resultado] Total de Vacinas Indicadas',

    // PESQUISA DE CONSCIENTIZAÇÃO
    '[Conscientização] Sabia que estava elegível para essas vacinas?',
  ];

  const rows = records.map((r) => {
    const facts = r.facts || {};
    const isFemale = r.sex === 'FEMININO';

    // Formatação de Identificação
    const dateStr = new Date(r.timestamp).toLocaleString('pt-BR');
    const unitStr =
      r.user_affiliation === 'DUMAS' || r.user_affiliation === 'PFIZER'
        ? 'Dumas'
        : r.user_affiliation === 'ITAPEVI'
        ? 'Itapevi'
        : r.user_affiliation === 'FORCA_DE_VENDAS'
        ? 'Força de Vendas'
        : r.user_affiliation || 'Não informado';
    const ageStr =
      r.age_bracket === '18_49'
        ? '18 a 49 anos'
        : r.age_bracket === '50_59'
        ? '50 a 59 anos'
        : r.age_bracket === '60_74'
        ? '60 a 74 anos'
        : '75 anos ou mais';
    const sexStr =
      r.sex === 'FEMININO'
        ? 'Feminino'
        : r.sex === 'MASCULINO'
        ? 'Masculino'
        : 'Não informado';

    // Página 2: Saúde da Mulher
    const isPregnant = formatBool(facts.is_pregnant, !isFemale);
    const pregnancyWeeks = formatBool(facts.pregnancy_weeks_32_36, !isFemale || !facts.is_pregnant);
    const isPostpartum = formatBool(facts.is_postpartum, !isFemale);

    // Página 3: Hábitos e Grupos Especiais
    const healthWorker = formatBool(facts.is_health_worker);
    const smoker = formatBool(facts.is_smoker);
    const alcoholism = formatBool(facts.has_alcoholism);
    const frailty = formatBool(facts.has_clinical_frailty);

    // Página 4: Cardiorrespiratórias
    const asthma = formatBool(facts.has_asthma);
    const copd = formatBool(facts.has_copd);
    const heartFailure = formatBool(facts.has_heart_failure);
    const coronary = formatBool(facts.has_coronary_disease);

    // Página 5: Metabólico, Renal e Hepático
    const diabetes = formatBool(facts.has_diabetes);
    const kidney = formatBool(facts.has_chronic_kidney_disease);
    const liver = formatBool(facts.has_chronic_liver_disease);
    const obesity = formatBool(facts.has_morbid_obesity_bmi_40);

    // Página 6: Imunossupressão e Outras
    const cancerImmuno = formatBool(facts.has_cancer || facts.has_immunosuppression);
    const asplenia = formatBool(facts.has_asplenia);
    const cochlear = formatBool(facts.has_cochlear_implant);
    const csfLeak = formatBool(facts.has_csf_leak);

    // Resultados
    const covidEligible = r.eligible_vaccines.includes('COVID_19') ? 'Sim' : 'Não';
    const covidReasons = (r.reasons_by_vaccine?.COVID_19 || []).join(' | ') || 'Nenhum critério prioritário';

    const vsrEligible = r.eligible_vaccines.includes('VSR') ? 'Sim' : 'Não';
    const vsrReasons = (r.reasons_by_vaccine?.VSR || []).join(' | ') || 'Nenhum critério prioritário';

    const pneumoEligible = r.eligible_vaccines.includes('PNEUMO_20') ? 'Sim' : 'Não';
    const pneumoReasons = (r.reasons_by_vaccine?.PNEUMO_20 || []).join(' | ') || 'Nenhum critério prioritário';

    const totalVaccines = r.eligible_vaccines.length;

    // Conscientização
    let awarenessStr = 'Não respondeu';
    if (r.awareness_feedback === 'SIM') awarenessStr = 'Sim, já sabia';
    if (r.awareness_feedback === 'NAO') awarenessStr = 'Não sabia';
    if (r.awareness_feedback === 'PARCIAL') awarenessStr = 'Sabia de algumas';

    return [
      escapeCsv(r.id),
      escapeCsv(dateStr),
      escapeCsv(unitStr),
      escapeCsv(ageStr),
      escapeCsv(sexStr),
      escapeCsv(isPregnant),
      escapeCsv(pregnancyWeeks),
      escapeCsv(isPostpartum),
      escapeCsv(healthWorker),
      escapeCsv(smoker),
      escapeCsv(alcoholism),
      escapeCsv(frailty),
      escapeCsv(asthma),
      escapeCsv(copd),
      escapeCsv(heartFailure),
      escapeCsv(coronary),
      escapeCsv(diabetes),
      escapeCsv(kidney),
      escapeCsv(liver),
      escapeCsv(obesity),
      escapeCsv(cancerImmuno),
      escapeCsv(asplenia),
      escapeCsv(cochlear),
      escapeCsv(csfLeak),
      escapeCsv(covidEligible),
      escapeCsv(covidReasons),
      escapeCsv(vsrEligible),
      escapeCsv(vsrReasons),
      escapeCsv(pneumoEligible),
      escapeCsv(pneumoReasons),
      escapeCsv(totalVaccines),
      escapeCsv(awarenessStr),
    ].join(';');
  });

  return [headers.map(escapeCsv).join(';'), ...rows].join('\r\n');
}
