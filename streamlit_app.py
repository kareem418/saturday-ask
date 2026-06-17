"""
🚨 Official Saturday Investigation — Streamlit edition.

Same page, same jokes, same dodging "No" button — just packaged for
Streamlit Community Cloud instead of Flask, so it gets a permanent public
link without needing your own computer to stay turned on.
"""

import random
from datetime import datetime
from pathlib import Path

import streamlit as st

BASE_DIR = Path(__file__).parent

st.set_page_config(
    page_title="🚨 Official Saturday Investigation",
    page_icon="🚨",
    layout="centered",
)

# Hide Streamlit's default chrome so it just looks like the page itself.
st.markdown(
    """
    <style>
      #MainMenu, header, footer {visibility: hidden;}
      .block-container {padding-top: 1rem; padding-bottom: 1rem;}
    </style>
    """,
    unsafe_allow_html=True,
)


def generate_case_number() -> str:
    today = datetime.now().strftime("%Y%m%d")
    return f"SAT-{today}-{random.randint(100, 999)}"


PAGE_TEMPLATE = """
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<style>
__CSS__
html, body { background: transparent; }
</style>

<div class="backdrop" aria-hidden="true">
  <div class="blob blob-a"></div>
  <div class="blob blob-b"></div>
  <div class="blob blob-c"></div>
  <div class="emoji-field" id="emojiField"></div>
</div>

<main class="stage">
  <div class="app-card" id="appCard">

    <p class="case-tag">CASE FILE NO. __CASE_NUMBER__</p>

    <section class="screen screen-intro is-active" id="screenIntro">
      <h1 class="headline">🚨 Official Saturday<br>Investigation 🚨</h1>
      <div class="intro-lines" id="introLines" aria-live="polite"></div>
    </section>

    <section class="screen screen-question" id="screenQuestion">
      <p class="eyebrow">FINDINGS &amp; RECOMMENDATION</p>
      <h2 class="question">Would you like to go out with me this Saturday? 😊</h2>

      <div class="button-stage" id="buttonStage">
        <button class="btn btn-yes" id="yesBtn" type="button">Yes 😎</button>
        <button class="btn btn-no" id="noBtn" type="button">No 🙃</button>
      </div>

      <p class="dodge-feedback" id="dodgeFeedback">&nbsp;</p>
    </section>

    <section class="screen screen-loading" id="screenLoading">
      <p class="eyebrow">PROCESSING</p>
      <h2 class="loading-title" id="loadingTitle">Calculating compatibility...</h2>

      <div class="progress-track" aria-hidden="true">
        <div class="progress-fill" id="progressFill"></div>
      </div>
      <p class="progress-percent" id="progressPercent">0%</p>
    </section>

    <section class="screen screen-success" id="screenSuccess">
      <div class="stamp" id="stamp">APPROVED</div>

      <h2 class="success-title">Excellent choice. The committee has<br>approved this decision. 🎉</h2>
      <p class="success-sub">Saturday unlocked successfully.</p>

      <div class="result-card">
        <span class="result-number" id="resultNumber">98.7%</span>
        <span class="result-label">chance of having a great time</span>
      </div>

      <p class="case-tag case-tag-closed">CASE __CASE_NUMBER__ — CLOSED ✅</p>
    </section>

  </div>
</main>

<canvas id="confettiCanvas" aria-hidden="true"></canvas>

<script>
__SCRIPT__
</script>
"""


def build_page() -> str:
    css = (BASE_DIR / "style.css").read_text(encoding="utf-8")
    js = (BASE_DIR / "script.js").read_text(encoding="utf-8")
    case_number = generate_case_number()

    html = PAGE_TEMPLATE.replace("__CSS__", css)
    html = html.replace("__SCRIPT__", js)
    html = html.replace("__CASE_NUMBER__", case_number)
    return html


st.iframe(build_page(), width="stretch", height=860)
