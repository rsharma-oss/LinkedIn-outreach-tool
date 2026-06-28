/* ICP Profile library — vertical "starter" ICPs (prototype).
   Each profile fully defines an ICP: per-tier label + description (drives the cards) +
   keyword list, plus an exclude list. Applying a profile = the multi-tenant config swap.
   These are FIRST DRAFTS to co-work — refine the hierarchies freely. */
window.ICP_PROFILES = {

  dtc: {
    name: "Shopify DTC / Ecommerce",
    t1: { label: "Decision Maker", desc: "Founders & marketing leaders at DTC brands",
      keywords: ["founder","co-founder","ceo","chief executive","cmo","chief marketing","president","owner","managing director","vp marketing","vp growth","vp ecommerce","head of marketing","head of ecommerce","head of dtc","director of ecommerce","director of growth","chief revenue"] },
    t2: { label: "Ecosystem", desc: "Shopify tools, agencies & ecommerce vendors",
      keywords: ["shopify","klaviyo","gorgias","yotpo","rebuy","recharge","postscript","triple whale","okendo","attentive","northbeam","aftership","fractional cmo","email marketing manager","retention specialist","lifecycle marketing","dtc marketing","ecommerce manager","crm manager","sms marketing"] },
    t3: { label: "Adjacent", desc: "Broader marketing & growth roles",
      keywords: ["marketing manager","digital marketing","content marketing","social media manager","brand manager","growth hacker","seo manager","performance marketing","marketing coordinator"] },
    exclude: ["retired","chief financial","cfo","chief technology","cto","board member","real estate","recruiter","software engineer","data scientist","student","intern","accountant","lawyer"]
  },

  saas: {
    name: "B2B SaaS",
    t1: { label: "Decision Maker", desc: "Founders & GTM / product leaders at software companies",
      keywords: ["founder","co-founder","ceo","cto","cmo","cro","chief revenue","chief product","chief executive","vp sales","vp marketing","vp product","vp engineering","head of growth","head of sales","head of product","head of revenue"] },
    t2: { label: "Ecosystem", desc: "SaaS platforms, GTM tools & their teams",
      keywords: ["salesforce","hubspot","marketo","segment","snowflake","datadog","gong","outreach","salesloft","zendesk","atlassian","stripe","saas","b2b software","account executive","sales engineer","solutions engineer","customer success","revenue operations","demand generation"] },
    t3: { label: "Adjacent", desc: "Product, growth & sales-support roles",
      keywords: ["product manager","growth marketer","sdr","bdr","sales development","marketing operations","sales operations","content marketer","partnerships manager","product marketing"] },
    exclude: ["retired","student","intern","recruiter","talent acquisition"]
  },

  telecom: {
    name: "Telecom",
    t1: { label: "Decision Maker", desc: "Network & telecom leaders",
      keywords: ["founder","ceo","cto","chief technology","chief network officer","chief information officer","president","managing director","vp network","vp engineering","vp technology","head of network","head of engineering","director of network","head of infrastructure"] },
    t2: { label: "Ecosystem", desc: "Carriers, equipment & network vendors",
      keywords: ["rogers","telus","bell","shaw","videotron","cogeco","freedom mobile","verizon","at&t","t-mobile","vodafone","ericsson","nokia","cisco","ciena","juniper","lumen","comcast","telecom","telecommunications","wireless","carrier","fiber","broadband","5g","network engineer","rf engineer"] },
    t3: { label: "Adjacent", desc: "Network engineering & field roles",
      keywords: ["network administrator","telecom engineer","wireless engineer","field engineer","noc","systems engineer","infrastructure engineer","network analyst","network specialist"] },
    exclude: ["retired","student","intern","volunteer"]
  },

  finserv: {
    name: "Financial Services / Fintech",
    t1: { label: "Decision Maker", desc: "Finance & investment leaders",
      keywords: ["founder","ceo","cfo","chief investment officer","chief financial","managing director","partner","principal","president","head of","vp finance","vp investments","portfolio manager","wealth advisor","general partner"] },
    t2: { label: "Ecosystem", desc: "Banks, asset managers, insurers & fintech",
      keywords: ["rbc","td","scotiabank","cibc","bmo","manulife","sun life","blackrock","goldman","jpmorgan","morgan stanley","fidelity","banking","wealth management","asset management","private equity","venture capital","insurance","fintech","capital","securities","investment management"] },
    t3: { label: "Adjacent", desc: "Analysts, advisors & operations roles",
      keywords: ["financial analyst","investment analyst","relationship manager","financial advisor","underwriter","compliance","risk manager","account manager","associate"] },
    exclude: ["retired","student","intern","volunteer"]
  }

};
