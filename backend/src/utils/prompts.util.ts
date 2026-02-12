export class PromptsUtil {
  /**
   * Generate prompt for User Persona creation
   */
  static getUserPersonaPrompt(researchContext: string, userContext: string): string {
    return `You are a UX research expert. Based on the research data provided, create a comprehensive user persona.

RESEARCH DATA:
${researchContext}

${userContext ? `ADDITIONAL CONTEXT:\n${userContext}\n` : ''}

Please create a detailed user persona in the following structured format:

# User Persona

## Demographics
- Name: [Create a realistic name]
- Age: [Age or age range]
- Occupation: [Job title/role]
- Location: [Geographic location]
- Education: [Education level]

## Background
[2-3 sentences describing their professional and personal background]

## Goals & Motivations
### Primary Goals:
- [Goal 1]
- [Goal 2]
- [Goal 3]

### Motivations:
- [Motivation 1]
- [Motivation 2]
- [Motivation 3]

## Pain Points & Frustrations
- [Pain point 1]
- [Pain point 2]
- [Pain point 3]

## Behaviors & Habits
- [Behavior 1]
- [Behavior 2]
- [Behavior 3]

## Technology Usage
- [Tech usage pattern 1]
- [Tech usage pattern 2]

## Quote
"[A quote that captures their attitude and perspective]"

## Needs & Expectations
- [Need 1]
- [Need 2]
- [Need 3]

Base all information strictly on the research data provided. Do not invent data that isn't supported by the research.`;
  }

  /**
   * Generate prompt for Journey Map creation
   */
  static getJourneyMapPrompt(researchContext: string, userContext: string): string {
    return `You are a UX research expert. Based on the research data provided, create a comprehensive user journey map.

RESEARCH DATA:
${researchContext}

${userContext ? `ADDITIONAL CONTEXT:\n${userContext}\n` : ''}

Please create a detailed user journey map in the following structured format:

# User Journey Map

## Journey Overview
- User: [User type/persona]
- Scenario: [Brief description of the journey scenario]
- Goal: [What the user wants to accomplish]

## Journey Stages

### Stage 1: [Stage Name - e.g., Awareness]
**Actions:**
- [Action 1]
- [Action 2]

**Thoughts:**
- [Thought 1]
- [Thought 2]

**Emotions:** 😊/😐/😔 [Emotional state]
[Description of emotional state]

**Pain Points:**
- [Pain point 1]
- [Pain point 2]

**Opportunities:**
- [Opportunity 1]
- [Opportunity 2]

### Stage 2: [Stage Name - e.g., Consideration]
**Actions:**
- [Action 1]
- [Action 2]

**Thoughts:**
- [Thought 1]
- [Thought 2]

**Emotions:** 😊/😐/😔 [Emotional state]
[Description of emotional state]

**Pain Points:**
- [Pain point 1]
- [Pain point 2]

**Opportunities:**
- [Opportunity 1]
- [Opportunity 2]

### Stage 3: [Stage Name - e.g., Purchase/Action]
**Actions:**
- [Action 1]
- [Action 2]

**Thoughts:**
- [Thought 1]
- [Thought 2]

**Emotions:** 😊/😐/😔 [Emotional state]
[Description of emotional state]

**Pain Points:**
- [Pain point 1]
- [Pain point 2]

**Opportunities:**
- [Opportunity 1]
- [Opportunity 2]

### Stage 4: [Stage Name - e.g., Experience/Usage]
**Actions:**
- [Action 1]
- [Action 2]

**Thoughts:**
- [Thought 1]
- [Thought 2]

**Emotions:** 😊/😐/😔 [Emotional state]
[Description of emotional state]

**Pain Points:**
- [Pain point 1]
- [Pain point 2]

**Opportunities:**
- [Opportunity 1]
- [Opportunity 2]

### Stage 5: [Stage Name - e.g., Post-Experience]
**Actions:**
- [Action 1]
- [Action 2]

**Thoughts:**
- [Thought 1]
- [Thought 2]

**Emotions:** 😊/😐/😔 [Emotional state]
[Description of emotional state]

**Pain Points:**
- [Pain point 1]
- [Pain point 2]

**Opportunities:**
- [Opportunity 1]
- [Opportunity 2]

## Key Insights
1. [Key insight 1]
2. [Key insight 2]
3. [Key insight 3]

## Recommendations
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

Base all information strictly on the research data provided. Ensure the journey reflects actual user experiences from the research.`;
  }

  /**
   * Generate prompt for Service Blueprint creation
   */
  static getServiceBlueprintPrompt(researchContext: string, userContext: string): string {
    return `You are a UX research expert. Based on the research data provided, create a comprehensive service blueprint.

RESEARCH DATA:
${researchContext}

${userContext ? `ADDITIONAL CONTEXT:\n${userContext}\n` : ''}

Please create a detailed service blueprint in the following structured format:

# Service Blueprint

## Service Overview
- Service: [Service name]
- Scenario: [Brief description of the service scenario]
- Goal: [What the service aims to achieve]

## Blueprint Structure

### Phase 1: [Phase Name - e.g., Discovery]

#### Customer Actions (What the customer does)
- [Action 1]
- [Action 2]
- [Action 3]

#### Frontstage (Visible employee interactions)
- [Interaction 1]
- [Interaction 2]
- [Interaction 3]

#### Backstage (Invisible employee actions)
- [Action 1]
- [Action 2]
- [Action 3]

#### Support Processes (Systems and technology)
- [Process/System 1]
- [Process/System 2]
- [Process/System 3]

#### Evidence (Physical/digital touchpoints)
- [Evidence 1]
- [Evidence 2]
- [Evidence 3]

---

### Phase 2: [Phase Name - e.g., Engagement]

#### Customer Actions
- [Action 1]
- [Action 2]
- [Action 3]

#### Frontstage
- [Interaction 1]
- [Interaction 2]
- [Interaction 3]

#### Backstage
- [Action 1]
- [Action 2]
- [Action 3]

#### Support Processes
- [Process/System 1]
- [Process/System 2]
- [Process/System 3]

#### Evidence
- [Evidence 1]
- [Evidence 2]
- [Evidence 3]

---

### Phase 3: [Phase Name - e.g., Service Delivery]

#### Customer Actions
- [Action 1]
- [Action 2]
- [Action 3]

#### Frontstage
- [Interaction 1]
- [Interaction 2]
- [Interaction 3]

#### Backstage
- [Action 1]
- [Action 2]
- [Action 3]

#### Support Processes
- [Process/System 1]
- [Process/System 2]
- [Process/System 3]

#### Evidence
- [Evidence 1]
- [Evidence 2]
- [Evidence 3]

---

### Phase 4: [Phase Name - e.g., Post-Service]

#### Customer Actions
- [Action 1]
- [Action 2]
- [Action 3]

#### Frontstage
- [Interaction 1]
- [Interaction 2]
- [Interaction 3]

#### Backstage
- [Action 1]
- [Action 2]
- [Action 3]

#### Support Processes
- [Process/System 1]
- [Process/System 2]
- [Process/System 3]

#### Evidence
- [Evidence 1]
- [Evidence 2]
- [Evidence 3]

---

## Pain Points & Failures
### Customer Pain Points:
- [Pain point 1]
- [Pain point 2]
- [Pain point 3]

### Service Failures:
- [Failure point 1]
- [Failure point 2]
- [Failure point 3]

## Opportunities for Improvement
1. [Opportunity 1]
2. [Opportunity 2]
3. [Opportunity 3]

## Key Insights
1. [Insight 1]
2. [Insight 2]
3. [Insight 3]

Base all information strictly on the research data provided. Ensure the blueprint accurately reflects the service delivery process.`;
  }
}
