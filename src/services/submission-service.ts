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
}

export interface AnalyticsSummary {
  totalRespondents: number;
  byAffiliation: {
    pfizer: number;
    itapevi: number;
  };
  byAgeBracket: Record<string, number>;
  vaccineStats: {
    COVID_19: { count: number; percentage: number };
    VSR: { count: number; percentage: number };
    PNEUMO_20: { count: number; percentage: number };
  };
  topConditions: { name: string; count: number; percentage: number }[];
  recentSubmissions: {
    id: string;
    timestamp: string;
    user_affiliation: string;
    age_bracket: string;
    sex: string;
    vaccines: string[];
  }[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'submissions.json');

function ensureFileExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function saveSubmission(data: Omit<SubmissionRecord, 'id' | 'timestamp'>): SubmissionRecord {
  ensureFileExists();
  const raw = fs.readFileSync(FILE_PATH, 'utf-8');
  const list: SubmissionRecord[] = JSON.parse(raw || '[]');

  const record: SubmissionRecord = {
    id: 'sub_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    timestamp: new Date().toISOString(),
    ...data,
  };

  list.unshift(record); // adiciona no início
  fs.writeFileSync(FILE_PATH, JSON.stringify(list, null, 2), 'utf-8');
  return record;
}

export function getAllSubmissions(affiliationFilter?: string): SubmissionRecord[] {
  ensureFileExists();
  const raw = fs.readFileSync(FILE_PATH, 'utf-8');
  const list: SubmissionRecord[] = JSON.parse(raw || '[]');

  if (affiliationFilter && affiliationFilter !== 'ALL') {
    return list.filter((r) => r.user_affiliation === affiliationFilter);
  }
  return list;
}

export function getAnalytics(affiliationFilter?: string): AnalyticsSummary {
  const records = getAllSubmissions(affiliationFilter);
  const total = records.length;

  const byAffiliation = { pfizer: 0, itapevi: 0 };
  const byAgeBracket: Record<string, number> = {
    '18_49': 0,
    '50_59': 0,
    '60_74': 0,
    '75_plus': 0,
  };

  let covidCount = 0;
  let vsrCount = 0;
  let pneumoCount = 0;

  const conditionCounts: Record<string, number> = {};

  const conditionLabels: Record<string, string> = {
    has_diabetes: 'Diabetes Mellitus',
    has_asthma: 'Asma',
    has_copd: 'DPOC / Enfisema',
    has_heart_failure: 'Insuficiência Cardíaca',
    has_coronary_disease: 'Doença Coronariana',
    has_chronic_kidney_disease: 'Doença Renal Crônica',
    has_chronic_liver_disease: 'Doença Hepática',
    has_cancer: 'Câncer',
    has_morbid_obesity_bmi_40: 'Obesidade Grau 3 (IMC ≥ 40)',
    is_smoker: 'Tabagismo Ativo',
    has_alcoholism: 'Alcoolismo',
    is_pregnant: 'Gestante',
    is_health_worker: 'Trabalhador da Saúde',
    has_clinical_frailty: 'Fragilidade Clínica',
    has_cochlear_implant: 'Implante Coclear',
    has_asplenia: 'Ausência ou disfunção do Baço',
  };

  for (const r of records) {
    if (r.user_affiliation === 'PFIZER') byAffiliation.pfizer++;
    if (r.user_affiliation === 'ITAPEVI') byAffiliation.itapevi++;

    if (r.age_bracket && byAgeBracket[r.age_bracket] !== undefined) {
      byAgeBracket[r.age_bracket]++;
    }

    if (r.eligible_vaccines.includes('COVID_19')) covidCount++;
    if (r.eligible_vaccines.includes('VSR')) vsrCount++;
    if (r.eligible_vaccines.includes('PNEUMO_20')) pneumoCount++;

    // Contagem de comorbidades
    for (const [factKey, val] of Object.entries(r.facts || {})) {
      if (val === true && conditionLabels[factKey]) {
        conditionCounts[factKey] = (conditionCounts[factKey] || 0) + 1;
      }
    }
  }

  const topConditions = Object.entries(conditionCounts)
    .map(([key, count]) => ({
      name: conditionLabels[key] || key,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const recentSubmissions = records.slice(0, 20).map((r) => ({
    id: r.id,
    timestamp: r.timestamp,
    user_affiliation: r.user_affiliation,
    age_bracket: r.age_bracket,
    sex: r.sex,
    vaccines: r.eligible_vaccines,
  }));

  return {
    totalRespondents: total,
    byAffiliation,
    byAgeBracket,
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
    topConditions,
    recentSubmissions,
  };
}

export function exportSubmissionsToCSV(affiliationFilter?: string): string {
  const records = getAllSubmissions(affiliationFilter);

  const header = [
    'ID',
    'Data/Hora',
    'Unidade',
    'Faixa Etaria',
    'Sexo',
    'COVID-19 Elegivel',
    'VSR Elegivel',
    'Pneumo 20 Elegivel',
    'Total Vacinas Indicadas',
    'Motivos Identificados',
  ];

  const rows = records.map((r) => {
    const covid = r.eligible_vaccines.includes('COVID_19') ? 'SIM' : 'NAO';
    const vsr = r.eligible_vaccines.includes('VSR') ? 'SIM' : 'NAO';
    const pneumo = r.eligible_vaccines.includes('PNEUMO_20') ? 'SIM' : 'NAO';
    const allReasons = Object.values(r.reasons_by_vaccine || {})
      .flat()
      .join('; ');

    const dateStr = new Date(r.timestamp).toLocaleString('pt-BR');
    const unitStr = r.user_affiliation === 'PFIZER' ? 'Colega Pfizer' : 'Itapevi';
    const ageStr =
      r.age_bracket === '18_49'
        ? '18 a 49 anos'
        : r.age_bracket === '50_59'
        ? '50 a 59 anos'
        : r.age_bracket === '60_74'
        ? '60 a 74 anos'
        : '75 anos ou mais';

    return [
      r.id,
      `"${dateStr}"`,
      `"${unitStr}"`,
      `"${ageStr}"`,
      `"${r.sex}"`,
      covid,
      vsr,
      pneumo,
      r.eligible_vaccines.length,
      `"${allReasons.replace(/"/g, '""')}"`,
    ].join(',');
  });

  return [header.join(','), ...rows].join('\r\n');
}
