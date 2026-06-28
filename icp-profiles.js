/* ICP Profile library — vertical "starter" ICPs (prototype).
   Tier model (June 28 co-work):
     • domain  — function words for the vertical; combined with a seniority rank → T1/T3.
     • t1.keywords — C-suite/founder titles that are decision-makers regardless of domain.
     • t2.companies — EXACT named target accounts (global). Anyone there = T2 (account layer).
     • t3.keywords — adjacent roles + loose sector concepts (the wide net).
     • exclude — pre-tier noise filter (per vertical).
   Engine also adds: senior rank × domain → T1, lower rank (Sr Manager/Manager) × domain → T3.
   Companies match whole-field + leading-word (R8). FIRST DRAFTS to co-work — refine freely. */
window.ICP_PROFILES = {

  dtc: {
    name: "Shopify DTC / Ecommerce",
    domain: ["marketing","growth","ecommerce","e-commerce","brand","retention","lifecycle","dtc","direct-to-consumer","digital","acquisition","merchandising","cro"],
    t1: { label: "Decision Maker", desc: "Founders & C-suite marketing leaders at DTC brands",
      keywords: ["founder","co-founder","ceo","chief executive","cmo","chief marketing","chief revenue","president","owner"] },
    t2: { label: "Named Accounts", desc: "People at Shopify tools & ecommerce vendors",
      companies: ["shopify","klaviyo","gorgias","yotpo","rebuy","recharge","postscript","triple whale","okendo","attentive","northbeam","aftership","tapcart","skio","bold commerce","shogun","loop"] },
    t3: { label: "Broader Sector", desc: "Marketing, growth & ecommerce roles + sector signal",
      keywords: ["marketing manager","digital marketing","content marketing","social media","brand manager","seo","performance marketing","email marketing","sms marketing","retention specialist","lifecycle marketing","ecommerce manager","shopify","klaviyo","dtc"] },
    exclude: ["retired","chief financial","cfo","chief technology","cto","board member","real estate","recruiter","software engineer","data scientist","student","intern","accountant","lawyer"]
  },

  saas: {
    name: "B2B SaaS",
    domain: ["sales","marketing","product","revenue","growth","go-to-market","gtm","customer success","demand","partnerships","saas","software"],
    t1: { label: "Decision Maker", desc: "Founders & C-suite GTM / product leaders",
      keywords: ["founder","co-founder","ceo","cto","cmo","cro","cpo","chief revenue","chief product","chief executive","chief technology","chief marketing","president"] },
    t2: { label: "Named Accounts", desc: "People at major SaaS platforms",
      companies: ["salesforce","hubspot","sap","oracle","adobe","atlassian","servicenow","workday","snowflake","datadog","segment","gong","outreach","salesloft","zendesk","stripe","marketo"] },
    t3: { label: "Broader Sector", desc: "Product, growth & sales roles + sector signal",
      keywords: ["product manager","growth marketer","sdr","bdr","sales development","account executive","sales engineer","solutions engineer","customer success","revenue operations","marketing operations","demand generation","product marketing","saas","b2b software"] },
    exclude: ["retired","student","intern","recruiter","talent acquisition"]
  },

  telecom: {
    name: "Telecom",
    domain: ["network","telecom","telecommunications","wireless","mobile","broadband","fiber","fibre","infrastructure","spectrum","5g","connectivity","rf"],
    t1: { label: "Decision Maker", desc: "Founders & C-suite network / telecom leaders",
      keywords: ["founder","ceo","cto","cio","chief technology","chief network","chief information","president","managing director"] },
    t2: { label: "Named Accounts", desc: "People at carriers, equipment & network vendors",
      companies: ["rogers","telus","bell","shaw","videotron","cogeco","freedom mobile","verizon","at&t","t-mobile","comcast","lumen","orange","vodafone","bt","deutsche telekom","telefonica","telia","telstra","singtel","sk telecom","ntt","ericsson","nokia","cisco","ciena","juniper"] },
    t3: { label: "Broader Sector", desc: "Network engineering & field roles + sector signal",
      keywords: ["network engineer","rf engineer","network administrator","telecom engineer","wireless engineer","field engineer","noc","systems engineer","infrastructure engineer","network analyst","telecom","wireless","fiber","broadband","5g"] },
    exclude: ["retired","student","intern","volunteer"]
  },

  finserv: {
    name: "Financial Services / Fintech",
    domain: ["finance","financial","investment","wealth","asset","banking","risk","credit","capital","treasury","portfolio","securities","markets","fintech"],
    t1: { label: "Decision Maker", desc: "Founders & C-suite finance / investment leaders",
      keywords: ["founder","ceo","cfo","cio","chief investment","chief financial","president","managing partner","general partner","managing director"] },
    t2: { label: "Named Accounts", desc: "People at banks, asset managers, insurers & fintech",
      companies: ["rbc","td","scotiabank","cibc","bmo","national bank","manulife","sun life","wealthsimple","questrade","blackrock","goldman sachs","jpmorgan","jp morgan","morgan stanley","fidelity","citi","citigroup","wells fargo","bank of america","hsbc","barclays","lloyds","natwest","ubs","deutsche bank","santander","bnp paribas","ing","standard chartered"] },
    t3: { label: "Broader Sector", desc: "Analysts, advisors & ops roles + sector signal",
      keywords: ["financial analyst","investment analyst","relationship manager","financial advisor","underwriter","compliance","risk manager","portfolio analyst","wealth management","asset management","banking","fintech","securities","investment management"] },
    exclude: ["retired","student","intern","volunteer"]
  }

};
