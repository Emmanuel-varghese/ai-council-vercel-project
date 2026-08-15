"use client";

import { useState } from "react";

const agents = [
  {
    key: "for",
    icon: "＋",
    name: "Advocate",
    role: "Builds the strongest case in favor",
    tone: "positive"
  },
  {
    key: "against",
    icon: "−",
    name: "Critic",
    role: "Builds the strongest case against",
    tone: "negative"
  },
  {
    key: "analyst",
    icon: "⌁",
    name: "Analyst",
    role: "Finds assumptions, uncertainty and consequences",
    tone: "neutral"
  },
  {
    key: "stakeholder",
    icon: "◎",
    name: "Stakeholder",
    role: "Considers who is affected and how",
    tone: "stakeholder"
  }
];

export default function Home() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runCouncil(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/council", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The council could not complete its analysis.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <nav className="nav">
        <div className="brand">
          <div className="brand-mark">⚖</div>
          <span>AI COUNCIL</span>
        </div>
        <div className="nav-pill">MULTI-PERSPECTIVE ANALYSIS</div>
      </nav>

      <section className="hero">
        <div className="eyebrow">A decision-making experiment</div>
        <h1>Ask the council.<br /><span>See every side.</span></h1>
        <p className="hero-copy">
          One question. Multiple AI perspectives. One final recommendation.
        </p>

        <form onSubmit={runCouncil} className="question-card">
          <label htmlFor="question">What should the council examine?</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: Should universities allow students to use AI on assignments?"
            maxLength={1000}
            disabled={loading}
          />
          <div className="input-footer">
            <span>{question.length}/1000</span>
            <button type="submit" disabled={loading || !question.trim()}>
              {loading ? "Council is deliberating…" : "Convene Council  →"}
            </button>
          </div>
        </form>

        {error && <div className="error">{error}</div>}
      </section>

      <section className="agents-section">
        <div className="section-label">THE COUNCIL</div>
        <div className="agent-grid">
          {agents.map((agent) => (
            <div className={`agent-card ${agent.tone}`} key={agent.key}>
              <div className="agent-icon">{agent.icon}</div>
              <div>
                <h3>{agent.name}</h3>
                <p>{agent.role}</p>
              </div>
            </div>
          ))}
          <div className="agent-card chair">
            <div className="agent-icon">♜</div>
            <div>
              <h3>Chairperson</h3>
              <p>Synthesizes the council and recommends a decision</p>
            </div>
          </div>
        </div>
      </section>

      {loading && (
        <section className="deliberating">
          <div className="loader" />
          <h2>The council is deliberating</h2>
          <p>Independent perspectives are being generated and synthesized.</p>
        </section>
      )}

      {result && !loading && (
        <section className="results">
          <div className="results-header">
            <div>
              <div className="section-label">COUNCIL REPORT</div>
              <h2>Deliberation complete.</h2>
            </div>
            <button className="new-question" onClick={() => {
              setResult(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}>
              New question
            </button>
          </div>

          <div className="question-display">
            <span>QUESTION</span>
            <p>{result.question}</p>
          </div>

          <div className="perspective-grid">
            <ResultCard title="Argument for" icon="＋" text={result.forArgument} tone="positive" />
            <ResultCard title="Argument against" icon="−" text={result.againstArgument} tone="negative" />
            <ResultCard title="Uncertainties" icon="?" text={result.uncertainties} tone="neutral" />
            <ResultCard title="Stakeholder impact" icon="◎" text={result.stakeholderImpacts} tone="stakeholder" />
          </div>

          <div className="synthesis-grid">
            <InfoBlock title="Areas of agreement" text={result.agreement} />
            <InfoBlock title="Areas of disagreement" text={result.disagreement} />
            <InfoBlock title="Implications" text={result.implications} />
            <InfoBlock title="Conditions that could change the recommendation" text={result.conditions} />
          </div>

          <div className="verdict">
            <div className="verdict-top">
              <span className="verdict-label">CHAIRPERSON'S RECOMMENDATION</span>
              <span className="verdict-badge">SYNTHESIZED</span>
            </div>
            <h3>{result.recommendation}</h3>
            <p>{result.reasoning}</p>
          </div>
        </section>
      )}

      <footer>
        <span>AI COUNCIL</span>
        <span>Multiple perspectives · Structured deliberation · Final synthesis</span>
      </footer>
    </main>
  );
}

function ResultCard({ title, icon, text, tone }) {
  return (
    <article className={`result-card ${tone}`}>
      <div className="result-card-heading">
        <span className="small-icon">{icon}</span>
        <h3>{title}</h3>
      </div>
      <p>{text}</p>
    </article>
  );
}

function InfoBlock({ title, text }) {
  return (
    <article className="info-block">
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
