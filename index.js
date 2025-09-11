import { pipefy } from "./controllers/pipefy.js";
import { gptMaker } from "./controllers/gptMaker.js";
import { rdStation } from "./controllers/rdStation.js";

// Refresh RD Token every 24h
await rdStation.refreshAccessToken();

const accessToken = rdStation.getAccessToken();

const pipeId = 306529415;
const segmentId = 17086323;

const leadsList = await rdStation.getLeadsList(accessToken, segmentId);

const leadId = leadsList[0].uuid;

const lead = await rdStation.getLeadById(accessToken, leadId);

const leadOrigin = await rdStation.getLeadOriginById(accessToken, leadId);

console.log("leadOrigin:", leadOrigin);

const leadObject = {
  name: lead.name,
  email: lead.email,
  answer: {
    se_sim_quem_seria: lead.cf_se_sim_quem_seria,
    ja_tem_alguma_documentacao_dele: lead.cf_ja_tem_alguma_documentacao_dele,
    voce_sabe_quem_e_o_portugues_da_sua_familia:
      lead.cf_voce_sabe_quem_e_o_portugues_da_sua_familia || "Nao",
    voce_ja_conhece_como_e_um_processo_da_busca_da_cidadania:
      lead.cf_voce_ja_conhece_como_e_um_processo_da_busca_da_cidadania_0 ||
      "Nao",
    busca_a_cidadania_somente_para_voce_ou_tem_mais_familiar:
      lead.cf_busca_a_cidadania_somente_para_voce_ou_tem_mais_familiar || "Nao",
  },
  origin: leadOrigin,
};

console.log(leadObject);

// console.log(accessToken);
