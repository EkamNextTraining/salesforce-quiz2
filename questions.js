// =====================================================================
//  SALESFORCE QUIZ — QUESTION BANK  (20 Questions)
//  Types:  "scenario"  → descriptive text answer
//          "coding"    → code editor answer
//          "mcq"       → 4 options, one correct (0-indexed)
// =====================================================================

const QUESTIONS = [

  // ══════════════════════════════════════════════════════════
  //  SECTION 1 — COMPANY SCENARIOS (10 questions, descriptive)
  // ══════════════════════════════════════════════════════════

  {
    type: "scenario",
    category: "Security & Access",
    scenario: `TechNova Solutions has onboarded a new batch of 50 junior support agents. These agents should be able to VIEW all Case records but must NOT be able to create, edit, or delete them. Currently all cases are created with "Private" OWD (Organisation-Wide Default).`,
    question: "What steps would you take in Salesforce to configure read-only access for these 50 agents without affecting existing user permissions?",
    placeholder: "Describe the step-by-step process: OWD settings, Profile configuration, Permission Sets, Sharing Rules, Role Hierarchy — explain each decision you make and why..."
  },

  {
    type: "scenario",
    category: "Automation",
    scenario: `GlobalPay Fintech wants to automatically send a Slack notification and create a follow-up Task whenever an Opportunity reaches "Negotiation/Review" stage AND the deal value exceeds ₹50 Lakhs. The admin has no coding experience.`,
    question: "Which Salesforce automation tool would you recommend and why? Walk through the complete configuration steps you would follow to implement this requirement.",
    placeholder: "Identify the right tool (Flow, Process Builder, Workflow, Apex), justify your choice, then describe the configuration: trigger, conditions, actions, testing steps..."
  },

  {
    type: "scenario",
    category: "Data Model",
    scenario: `MediCare Hospital runs a Salesforce org where each Doctor (custom object) can be associated with multiple Departments (custom object), and each Department can have multiple Doctors. The current setup uses a Lookup from Doctor to Department, but reports show data inconsistency.`,
    question: "What data model design would you recommend to properly represent a many-to-many relationship between Doctors and Departments? Describe the objects, fields, and relationship type you would create.",
    placeholder: "Explain the Junction Object pattern, describe the objects you'd create, the relationship types (Master-Detail vs Lookup), roll-up summary fields, and how reports would work..."
  },

  {
    type: "scenario",
    category: "Sales Cloud",
    scenario: `FreshMart FMCG has a Sales team of 200 reps across 4 regions (North, South, East, West). Each rep should only see their OWN Leads. Regional Managers should see all Leads in their region. The National Head must see all Leads across India.`,
    question: "Design the complete security model (OWD, Role Hierarchy, Sharing Rules) for FreshMart's Salesforce org to satisfy these visibility requirements.",
    placeholder: "Define OWD for Lead object, draw/describe the Role Hierarchy structure, explain what sharing rules (if any) are needed, and verify the access each persona gets..."
  },

  {
    type: "scenario",
    category: "Service Cloud",
    scenario: `ZenBank's customer support team receives 2,000+ cases daily via Email, Web, Chat, and WhatsApp. High-priority cases (P1) must be assigned to Senior Agents within 5 minutes. Currently, all cases go to a single queue and senior agents are manually picking cases.`,
    question: "How would you configure Salesforce Service Cloud to automate intelligent case routing and ensure SLA compliance for ZenBank? Mention all relevant features you would use.",
    placeholder: "Cover: Omni-Channel setup, Routing Configurations, Service Channels, Queues, Escalation Rules, Entitlements & Milestones, Skill-based routing — explain how they work together..."
  },

  {
    type: "scenario",
    category: "Reports & Analytics",
    scenario: `SparkEd EdTech wants a real-time executive dashboard showing: (1) Monthly new student enrollments by course, (2) Revenue trend (last 12 months), (3) Course completion rate by trainer, (4) Top 10 sales reps by revenue this quarter. The CEO wants this on a TV screen that auto-refreshes.`,
    question: "Walk through how you would build this dashboard in Salesforce. What report types, chart types, and dashboard features would you use for each component?",
    placeholder: "For each of the 4 components, specify: report type (Summary/Matrix/Joined), grouping fields, chart type, dashboard component type. Also explain auto-refresh setup and dynamic filters..."
  },

  {
    type: "scenario",
    category: "Data Management",
    scenario: `AeroLogistics imported 1,00,000 Account records from their legacy CRM last month. Post-migration, they discovered that 15,000 records are duplicates (same company name + phone). Additionally, 8,000 records have incorrect country codes. The data team wants to fix this without losing any existing related Contacts or Opportunities.`,
    question: "What is your step-by-step plan to clean this data in Salesforce? Which tools and features would you use to handle duplicates and bulk updates safely?",
    placeholder: "Cover: Duplicate Rules & Matching Rules, Salesforce DMP, Data Loader for mass update, Merge functionality, how to preserve child records during merge, sandbox testing approach, backup strategy..."
  },

  {
    type: "scenario",
    category: "Integration",
    scenario: `RetailPro wants to sync their SAP ERP inventory data into Salesforce every 15 minutes. Product quantities from SAP should update a custom field 'Available_Stock__c' on the Product2 object in Salesforce. The IT team wants a reliable, monitored integration.`,
    question: "What integration approach and Salesforce features would you recommend for this real-time inventory sync? Explain the architecture, tools, and error handling strategy.",
    placeholder: "Discuss: REST/SOAP API vs MuleSoft vs Platform Events, Connected App setup, Named Credentials, error logs, retry logic, monitoring with API usage limits, security considerations..."
  },

  {
    type: "scenario",
    category: "CPQ / Sales Process",
    scenario: `BuildTech Construction's sales team creates Quotes manually in Excel and emails them to clients. Deal cycle is 45 days on average, with frequent pricing errors. Management wants to move Quote generation into Salesforce with automated approval if discount > 20%.`,
    question: "How would you implement a Quote-to-Approval process in Salesforce? Describe the setup from Quote creation to the automated approval workflow.",
    placeholder: "Cover: Quote object setup, Product Catalog (Pricebooks), Quote Line Items, PDF template configuration, Approval Process setup (criteria, approvers, approval steps, email templates), testing..."
  },

  {
    type: "scenario",
    category: "Change Management",
    scenario: `CloudFirst Agency just completed a major Salesforce release in production that introduced 3 new Flows and updated 5 page layouts. Within 2 hours, the support team reports that Cases are not routing correctly and a critical picklist field is missing from the Case form.`,
    question: "How would you troubleshoot and resolve this production issue? Walk through your investigation process, how you would identify the root cause, and the steps to fix it with minimal disruption.",
    placeholder: "Cover: Debug Logs, Flow debug mode, comparing sandbox vs production, Deployment rollback options (Change Sets), communicating with stakeholders, testing fix in sandbox first, post-deployment verification..."
  },

  // ══════════════════════════════════════════════════════════
  //  SECTION 2 — LIVE CODING (5 questions)
  // ══════════════════════════════════════════════════════════

  {
    type: "coding",
    category: "Apex — Triggers",
    scenario: `InvestCorp uses Salesforce to manage Accounts. Whenever an Account's 'Annual Revenue' is updated to more than ₹1 Crore (10,000,000), a Task must be automatically created and assigned to the Account Owner with Subject = "High-Value Account Review" and Due Date = 30 days from today.`,
    question: "Write a bulkified Apex Trigger on the Account object to implement this business requirement.",
    language: "Apex",
    placeholder: `trigger AccountTrigger on Account (after update) {
    // Write your bulkified trigger here
    // Hint: Use collections (List, Map) to avoid SOQL/DML inside loops
    
}`,
    codeHint: "Remember: Use after update trigger, check for field change (old vs new), bulkify using List<Task>, insert outside loop."
  },

  {
    type: "coding",
    category: "SOQL — Queries",
    scenario: `DataPulse Analytics needs a report query for their ops team. They need all Contacts who: (1) belong to Accounts in the 'Technology' industry, (2) were created in the last 30 days, (3) have an email address, and (4) whose Account has at least 1 open Opportunity. Results should be ordered by Account Name.`,
    question: "Write the SOQL query to fetch the required Contact records with related Account and Opportunity information.",
    language: "SOQL",
    placeholder: `// Write your SOQL query here
// Hint: Use relationship queries (Account.Industry, Account.Opportunities)
// You can use semi-join (IN with subquery) for the Opportunity condition

SELECT `,
    codeHint: "Use SELECT ... FROM Contact WHERE ... and a semi-join subquery: Id IN (SELECT ContactId FROM ...) or a parent-child sub-select."
  },

  {
    type: "coding",
    category: "Apex — Batch",
    scenario: `CleanData Corp has 5,00,000 old Lead records where the 'LeadSource' field is blank. They need to set LeadSource = 'Legacy Import' for all such records. Running this synchronously caused a timeout error. The Salesforce admin has asked you to write a Batch Apex solution.`,
    question: "Write a complete Batch Apex class to update the LeadSource field for all Leads where it is currently null or blank.",
    language: "Apex",
    placeholder: `global class UpdateLeadSourceBatch implements Database.Batchable<SObject> {
    
    global Database.QueryLocator start(Database.BatchableContext bc) {
        // Write your SOQL query here
    }
    
    global void execute(Database.BatchableContext bc, List<Lead> scope) {
        // Process each batch here
    }
    
    global void finish(Database.BatchableContext bc) {
        // Optional: send notification email
    }
}`,
    codeHint: "Use Database.Batchable<SObject>, QueryLocator for large data sets, process in execute(), call Database.executeBatch(new UpdateLeadSourceBatch(), 200) to run."
  },

  {
    type: "coding",
    category: "LWC — Component",
    scenario: `PrimeCare Hospital wants a custom Lightning Web Component on the Contact record page. The component should display a greeting like "Hello, [Contact Name]! Your Account is: [Account Name]" by reading the current record's fields without a separate Apex call.`,
    question: "Write the HTML and JavaScript files for this Lightning Web Component using @wire and the getRecord adapter.",
    language: "LWC (JS + HTML)",
    placeholder: `// === contactGreeting.js ===
import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Contact.Account.Name';

export default class ContactGreeting extends LightningElement {
    @api recordId;
    
    // Wire the record here
    
    // Compute greeting message
    get greeting() {
        // Return the greeting string
    }
}

// === contactGreeting.html ===
// Write the template here`,
    codeHint: "Use @wire(getRecord, { recordId: '$recordId', fields: [...] }) and getFieldValue() to extract field values. Handle loading/error states."
  },

  {
    type: "coding",
    category: "Apex — REST API",
    scenario: `LogiTrack wants an external mobile app to fetch all open Cases (Status != 'Closed') for a specific Account by passing the Account ID. They need a custom REST endpoint: GET /services/apexrest/cases/{accountId}`,
    question: "Write an Apex REST class that exposes this endpoint and returns a JSON response with Case Id, CaseNumber, Subject, Status, and Priority.",
    language: "Apex REST",
    placeholder: `@RestResource(urlMapping='/cases/*')
global with sharing class CaseRestService {
    
    @HttpGet
    global static void getCasesByAccount() {
        // Get the Account ID from the URL
        // Query Cases
        // Return JSON response
        // Handle errors (account not found, no cases)
    }
    
    // Optional: inner class for response wrapper
    
}`,
    codeHint: "Use RestRequest.requestURI to extract accountId, query Cases with SOQL, use RestResponse to set status and body. Return JSON using JSON.serialize()."
  },

  // ══════════════════════════════════════════════════════════
  //  SECTION 3 — MCQ (5 questions)
  // ══════════════════════════════════════════════════════════

  {
    type: "mcq",
    category: "Governor Limits",
    scenario: `DevForce is writing an Apex trigger that processes up to 200 Account records in a single transaction.`,
    question: "Which of the following statements is TRUE regarding Salesforce Apex Governor Limits in a single transaction?",
    options: [
      "You can make up to 150 SOQL queries and 150 DML statements per transaction",
      "You can make up to 100 SOQL queries and 150 DML statements per transaction",
      "Governor Limits apply only to Scheduled Apex, not to Triggers",
      "Batch Apex has the same SOQL limit (100) per execute() call as synchronous Apex"
    ],
    answer: 1
  },

  {
    type: "mcq",
    category: "Security Model",
    scenario: `SecureBank wants to ensure that even Salesforce Admins cannot read certain sensitive salary fields on the Employee__c object.`,
    question: "Which Salesforce feature can RESTRICT field visibility even from System Administrators?",
    options: [
      "Role Hierarchy with 'Grant Access Using Hierarchies' unchecked",
      "Field-Level Security set to Hidden on the Admin Profile",
      "Encrypted Custom Fields using Salesforce Shield Platform Encryption",
      "Field-Level Security cannot restrict System Administrators — they see all fields"
    ],
    answer: 2
  },

  {
    type: "mcq",
    category: "Deployment",
    scenario: `BlueSky Corp's developer has built a complex Flow in the sandbox and needs to deploy it to production along with custom fields and an Apex class.`,
    question: "Which of the following is the RECOMMENDED approach for deploying metadata from Sandbox to Production in an enterprise Salesforce org?",
    options: [
      "Manually recreate everything in Production since you cannot deploy Flows",
      "Use Change Sets — they support all metadata types including Flows and Apex",
      "Use Salesforce CLI (sf) with a package.xml to deploy via source-tracked sandboxes, which supports all metadata types and version control",
      "Export data using Data Loader and reimport in Production"
    ],
    answer: 2
  },

  {
    type: "mcq",
    category: "Flow Automation",
    scenario: `EduSpark wants a Flow that creates a Contact record immediately when an Account is created, using the same Name and Phone from the Account.`,
    question: "In which Flow type and trigger combination is this BEST implemented?",
    options: [
      "Screen Flow triggered manually by the user after Account creation",
      "Record-Triggered Flow on Account object, triggered 'After the record is saved', using a Create Records element",
      "Scheduled Flow that runs nightly to check for new Accounts",
      "Record-Triggered Flow on Account object, triggered 'Before the record is saved', using a Create Records element"
    ],
    answer: 1
  },

  {
    type: "mcq",
    category: "Data & Storage",
    scenario: `StoragePro notices their Salesforce org is approaching its data storage limit. An analyst says that deleting records will immediately free up storage.`,
    question: "Which of the following is TRUE about Salesforce data storage management?",
    options: [
      "Deleting records immediately frees data storage because records are permanently removed",
      "Records in the Recycle Bin still count against your data storage limit until permanently deleted or the 15-day retention period expires",
      "Attachments and Files (ContentDocument) do NOT count towards data storage — only standard and custom object records do",
      "You can increase data storage by purchasing more API call add-ons"
    ],
    answer: 1
  }

];
