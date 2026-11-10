import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Volume2, VolumeX, RotateCcw, ArrowRight, Heart, Sparkles, Gift } from 'lucide-react'
import './style.css'

const reasons = [
  'You make even the most ordinary days feel full of joy and laughter.',
  'Nobody listens, understands, or supports me the way you do.',
  'Your kindness, warmth, and bright energy effortlessly lift everyone up.',
  'You are the most genuine, dependable, and amazing best friend anyone could ask for.',
  'Thank you for being my constant comfort and favorite person to share every moment with.'
]

const stars = Array.from({ length: 64 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  delay: `${(i % 9) * .37}s`,
  size: i % 7 === 0 ? 3 : 1.5
}))

function App() {
  const [screen, setScreen] = useState(0)
  const [popped, setPopped] = useState<number[]>([])
  const [candleLit, setCandleLit] = useState(false)
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const [arrowShot, setArrowShot] = useState(false)
  const [typed, setTyped] = useState(false)
  const audioRef = useRef<{ctx: AudioContext, nodes: OscillatorNode[], gain: GainNode} | null>(null)

  const next = () => setScreen(s => Math.min(7, s + 1))
  const replay = () => {
    setScreen(0); setPopped([]); setCandleLit(false); setEnvelopeOpen(false)
    setArrowShot(false); setTyped(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleMusic = async () => {
    if (musicOn) {
      audioRef.current?.nodes.forEach(n => { try { n.stop() } catch {} })
      audioRef.current?.ctx.close()
      audioRef.current = null
      setMusicOn(false)
      return
    }
    try {
      const ctx = new AudioContext()
      await ctx.resume()
      const gain = ctx.createGain()
      gain.gain.value = 0.018
      gain.connect(ctx.destination)
      const nodes: OscillatorNode[] = []
      ;[174.61, 220, 261.63].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'sine'; osc.frequency.value = freq
        g.gain.value = i === 0 ? 0.45 : 0.2
        osc.connect(g); g.connect(gain); osc.start()
        nodes.push(osc)
      })
      audioRef.current = { ctx, nodes, gain }
      setMusicOn(true)
    } catch { setMusicOn(false) }
  }

  useEffect(() => () => {
    audioRef.current?.nodes.forEach(n => { try { n.stop() } catch {} })
    audioRef.current?.ctx.close()
  }, [])

  useEffect(() => {
    if (screen === 6 && envelopeOpen) {
      const timer = window.setTimeout(() => setTyped(true), 250)
      return () => window.clearTimeout(timer)
    }
  }, [screen, envelopeOpen])

  const confetti = Array.from({ length: 46 }, (_, i) => <i key={i} className="confetti" style={{ left: `${(i * 29) % 100}%`, animationDelay: `${(i % 13) * .19}s`, transform: `rotate(${i * 31}deg)` }} />)

  return <main className={`app screen-${screen}`}>
    <div className="stars" aria-hidden="true">{stars.map((s,i) => <i key={i} style={{ left:s.left, top:s.top, animationDelay:s.delay, width:s.size, height:s.size }} />)}</div>
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className="topbar">
      <div className="tiny-mark"><span>✦</span> A LITTLE MOMENT FOR FAREHA</div>
      <button className="sound-btn" onClick={toggleMusic} aria-label={musicOn ? 'Turn ambient sound off' : 'Turn ambient sound on'} title={musicOn ? 'Mute ambience' : 'Play ambience'}>
        {musicOn ? <Volume2 size={17}/> : <VolumeX size={17}/>}
        <span>{musicOn ? 'Sound on' : 'Sound off'}</span>
      </button>
    </header>

    {screen === 0 && <section className="scene dark entry">
      <div className="orbital">✧</div>
      <div className="eyebrow gold">A SMALL SURPRISE, MADE WITH LOVE</div>
      <div className="gift-icon"><Gift size={43} strokeWidth={1.15}/><span>✦</span></div>
      <p className="made">Ali made this — just for you</p>
      <h1>A SURPRISE<br/><em>FOR FAREHA</em></h1>
      <p className="subline">Some people make life a little brighter.<br/>Today, we're celebrating one of them.</p>
      <button className="primary gold-button" onClick={next}>🎁 &nbsp; Unwrap it <ArrowRight size={16}/></button>
      <div className="bottom-note">TAKE YOUR TIME · THIS IS YOUR MOMENT</div>
    </section>}

    {screen === 1 && <section className="scene cream arrow-scene">
      <div className="eyebrow">A LITTLE MAGIC, COMING YOUR WAY</div>
      <h2>Ready, aim… <em>heart.</em></h2>
      <p className="scene-copy">A tiny reminder that you are loved and appreciated.</p>
      <div className="archery">
        <div className={`heart-3d ${arrowShot ? 'hit' : ''}`}>♥</div>
        <div className={`arrow ${arrowShot ? 'shot' : ''}`}>➶</div>
        <div className="bow">)</div>
      </div>
      <button className="primary dark-button" onClick={() => { if (!arrowShot) { setArrowShot(true); window.setTimeout(next, 1100) } }}> {arrowShot ? 'A little love, delivered ✨' : 'Pull & release'} </button>
      <p className="hint">TAP TO RELEASE THE ARROW</p>
    </section>}

    {screen === 2 && <section className="scene crimson reveal">
      <div className="eyebrow light-gold">TODAY IS ALL ABOUT YOU</div>
      <div className="wish-star">✦</div>
      <h1>Make a wish<span>...</span></h1>
      <p className="reveal-copy">Happy Birthday to someone<br/>worth celebrating.</p>
      <button className="text-next" onClick={next}>There's more <ArrowRight size={15}/></button>
    </section>}

    {screen === 3 && <section className="scene cream tree-scene">
      <div className="eyebrow">A NEW CHAPTER BEGINS</div>
      <div className="tree-art" aria-label="A tree blossoming with pink hearts">
        <div className="trunk"/>
        {Array.from({length:24},(_,i)=><span key={i} className="leaf" style={{left:`${12+(i*31)%76}%`,top:`${8+(i*19)%48}%`,animationDelay:`${i*.075}s`,fontSize:`${17+(i%4)*5}px`}}>♥</span>)}
        <span className="tree-sparkle s1">✦</span><span className="tree-sparkle s2">✧</span><span className="tree-sparkle s3">✦</span>
      </div>
      <p className="tree-kicker">IT'S OFFICIALLY YOUR DAY</p>
      <h2>Happy Birthday,<br/><em>Fareha!</em></h2>
      <p className="age-line">And just like that, you're turning <strong>23</strong> ✨</p>
      <button className="primary dark-button" onClick={next}>Continue <ArrowRight size={16}/></button>
    </section>}

    {screen === 4 && <section className="scene dark cake-scene">
      <div className="eyebrow gold">FIRST THINGS FIRST 🎂</div>
      <h2>Baking something<br/><em>sweet…</em></h2>
      <p className="scene-copy">A birthday isn't complete without a wish.</p>
      <div className="cake-wrap" onClick={() => setCandleLit(true)} role="button" tabIndex={0} onKeyDown={e=>e.key==='Enter'&&setCandleLit(true)} aria-label="Light the birthday candle">
        <div className={`flame ${candleLit?'lit':''}`}>✦</div><div className="candle"><i/></div>
        <div className="cake-top"/><div className="cake-body"><span>✧</span><span>♥</span><span>✧</span></div><div className="cake-plate"/>
      </div>
      {candleLit ? <><p className="cake-message">Happy Birthday, Fareha!<br/><em>Make a wish…</em></p><button className="primary gold-button" onClick={next}>Tap anywhere to continue <ArrowRight size={16}/></button></> : <><p className="hint gold-hint">TAP THE CANDLE TO LIGHT IT</p><button className="primary gold-button" onClick={()=>setCandleLit(true)}>Light the candle ✨</button></>}
    </section>}

    {screen === 5 && <section className="scene cream balloons-scene">
      <div className="eyebrow">A FEW THINGS YOU SHOULD KNOW</div>
      <h2>Pop the balloons <span>🎈</span></h2>
      <p className="scene-copy">5 balloons. Each one holds a reason you're valued as my best friend. Pop them all ✨</p>
      <div className="balloon-field">
        {reasons.map((reason,i)=><button key={i} className={`balloon balloon-${i+1} ${popped.includes(i)?'popped':''}`} onClick={()=>setPopped(p=>p.includes(i)?p:[...p,i])} aria-label={`Pop balloon ${i+1}`} disabled={popped.includes(i)}>
          {popped.includes(i) ? <span className="pop-mark">✦</span> : <><span className="balloon-number">{i+1}</span><i/></>}
        </button>)}
      </div>
      <div className="reason-list">
        {reasons.map((r,i)=>popped.includes(i)&&<article className="reason-card" key={i}><span>0{i+1}</span><p>{r}</p><Heart size={15}/></article>)}
      </div>
      <p className="progress">{popped.length} OF 5 REASONS REVEALED</p>
      {popped.length===5 && <button className="primary dark-button" onClick={next}>One last thing… <ArrowRight size={16}/></button>}
    </section>}

    {screen === 6 && <section className="scene cream letter-scene">
      <div className="eyebrow">SAVED FOR THE END</div>
      <h2>One last thing,<br/><em>Fareha…</em></h2>
      <p className="scene-copy">Ali wrote you a letter.</p>
      {!envelopeOpen ? <button className="envelope" onClick={()=>setEnvelopeOpen(true)} aria-label="Open your letter">
        <div className="envelope-paper">A little note<br/>for you</div><div className="envelope-flap"/><div className="envelope-heart">♥</div>
        <span className="open-label">TAP TO OPEN</span>
      </button> : <article className="letter-card">
        <div className="letter-flourish">✦ &nbsp; A NOTE FOR YOU &nbsp; ✦</div>
        <div className={`letter-body ${typed?'shown':''}`}>
          <p>Dear Fareha,</p>
          <p>Happy 23rd Birthday! Having you as my best friend is one of the greatest blessings in my life. Your laughter brightens every room, and your presence brings a kind of warmth that makes everything feel right.</p>
          <p>Thank you for every shared laugh, late-night chat, and every single moment we've celebrated together. On your special day, I wish you all the happiness, peace, and endless success you so truly deserve.</p>
          <p>Happy Birthday, bestie! ✨</p>
          <p className="signoff">With warm love,<br/><span>Ali</span></p>
        </div>
      </article>}
      {envelopeOpen && <button className="primary dark-button" onClick={next}>Keep this with you <ArrowRight size={16}/></button>}
    </section>}

    {screen === 7 && <section className="scene dark finale">
      <div className="confetti-layer">{confetti}</div>
      <div className="final-spark">✦</div>
      <div className="eyebrow gold">A WISH FOR YOUR YEAR AHEAD</div>
      <div className="final-heart">♥</div>
      <h1>HAPPY BIRTHDAY<br/><em>FAREHA!</em></h1>
      <p className="final-copy">May 23 bring you beautiful beginnings,<br/>soft moments, loud laughter and everything<br/>your heart has been wishing for.</p>
      <div className="final-sign">Made with love, <span>Ali</span></div>
      <button className="primary gold-button" onClick={replay}><RotateCcw size={16}/> Replay the Preview</button>
      <div className="footer">A LITTLE SURPRISE · MADE JUST FOR YOU ✨</div>
    </section>}

    {screen > 0 && screen < 7 && <div className="progress-track"><span style={{width:`${(screen/7)*100}%`}}/></div>}
  </main>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)
