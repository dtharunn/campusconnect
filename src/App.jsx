import React from "react";
import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, MapPin, Users, Search, Ticket, X, CheckCircle2, GraduationCap, Sparkles, ArrowUpRight, Clock3, ChevronRight } from 'lucide-react';

const EVENTS_KEY = 'campusconnect_events_v1';
const REGS_KEY = 'campusconnect_registrations_v1';

const seedEvents = [
  {
    id: 'evt-techfest',
    title: 'Campus TechFest 2026',
    category: 'Technology',
    date: '2026-11-12',
    time: '09:30',
    venue: 'Main Auditorium',
    capacity: 120,
    registeredCount: 120,
    description: 'A full day of innovation, coding challenges, project showcases, and technology talks.',
    emoji: '💻',
    cancelAllowed: true
  },
  {
    id: 'evt-design',
    title: 'Design Thinking Workshop',
    category: 'Workshop',
    date: '2026-11-05',
    time: '10:00',
    venue: 'Innovation Lab · Block B',
    capacity: 45,
    registeredCount: 45,
    description: 'Learn user-centered design, rapid ideation, and how to turn a problem into a prototype.',
    emoji: '✏️',
    cancelAllowed: true
  },
  {
    id: 'evt-career',
    title: 'Career Connect: Industry Day',
    category: 'Career',
    date: '2026-11-18',
    time: '11:00',
    venue: 'Seminar Hall 2',
    capacity: 90,
    registeredCount: 80,
    description: 'Meet industry professionals, discover career paths, and get practical interview advice.',
    emoji: '🚀',
    cancelAllowed: true
  },
  {
    id: 'evt-music',
    title: 'Rhythm & Roots',
    category: 'Arts & Culture',
    date: '2026-11-08',
    time: '16:30',
    venue: 'Open-Air Theatre',
    capacity: 200,
    registeredCount: 125,
    description: 'An evening of student performances, music, dance, and creative expression.',
    emoji: '🎭',
    cancelAllowed: false
  },
  {
    id: 'evt-sports',
    title: 'Inter-Department Sports Meet',
    category: 'Sports',
    date: '2026-11-21',
    time: '08:00',
    venue: 'College Sports Ground',
    capacity: 160,
    registeredCount: 100,
    description: 'Bring your team spirit to a day of friendly competition across departments.',
    emoji: '🏆',
    cancelAllowed: true
  },
  {
    id: 'evt-ai',
    title: 'AI & Future Technologies',
    category: 'Technology',
    date: '2026-11-27',
    time: '13:00',
    venue: 'Digital Learning Centre',
    capacity: 75,
    registeredCount: 75,
    description: 'Explore practical AI applications, responsible innovation, and emerging technology trends.',
    emoji: '🤖',
    cancelAllowed: true
  },
];
function readStore(key, fallback) { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }
function formatDate(e) { return new Date(`${e.date}T${e.time || '12:00'}:00`).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}); }
function formatTime(e) { return new Date(`${e.date}T${e.time || '12:00'}:00`).toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'}); }

export default function App() {
const [events, setEvents] = useState(() => {
  const saved = readStore(EVENTS_KEY, null);

  if (!Array.isArray(saved)) {
    return seedEvents;
  }

  return seedEvents.map(seed => {
    const existing = saved.find(event => event.id === seed.id);

    return {
      ...existing,
      ...seed
    };
  });
});
 const [registrations,setRegistrations] = useState(() => { const saved=readStore(REGS_KEY,[]); return Array.isArray(saved)?saved:[]; });
 const [page,setPage] = useState('events');
 const [query,setQuery] = useState(''); const [category,setCategory] = useState(''); const [date,setDate] = useState('');
 const [selected,setSelected] = useState(null); const [detail,setDetail] = useState(null); const [toast,setToast] = useState('');
 const [form,setForm] = useState({name:'',studentId:'',email:'',department:''}); const [formError,setFormError] = useState('');
 useEffect(()=>localStorage.setItem(EVENTS_KEY,JSON.stringify(events)),[events]);
 useEffect(()=>localStorage.setItem(REGS_KEY,JSON.stringify(registrations)),[registrations]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),3000);return()=>clearTimeout(t)},[toast]);
 const countFor = id => {
  const event = events.find(e => e.id === id);
  if (!event) return 0;

  const actualRegistrations = registrations.filter(
    r => r.eventId === id
  ).length;

  return Math.max(
    Number(event.registeredCount) || 0,
    actualRegistrations
  );
};
 const isFull = e => Number(e.capacity)>0 && countFor(e.id)>=Number(e.capacity);
 const remaining = e => Number(e.capacity)>0?Math.max(0,Number(e.capacity)-countFor(e.id)):null;
 const filtered = useMemo(()=>events.filter(e=>(`${e.title} ${e.description} ${e.venue} ${e.category}`).toLowerCase().includes(query.trim().toLowerCase())&&(!category||e.category===category)&&(!date||e.date===date)).sort((a,b)=>a.date.localeCompare(b.date)),[events,query,category,date,registrations]);
 const upcomingCount = events.filter(e=>e.date>=new Date().toISOString().slice(0,10)).length;
 function startRegistration(e) { if(isFull(e)){setToast('This event has reached capacity.');return;} if(new Date(`${e.date}T${e.time||'12:00'}:00`)<new Date()){setToast('Registration for this event has closed.');return;} setSelected(e);setForm({name:'',studentId:'',email:'',department:''});setFormError(''); }
 function submitRegistration(ev) { ev.preventDefault(); if(!selected)return; const name=form.name.trim(),studentId=form.studentId.trim(),email=form.email.trim().toLowerCase(); if(!name||!studentId||!email||!form.department){setFormError('Please complete all required fields.');return;} if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setFormError('Enter a valid email address.');return;} if(isFull(selected)){setFormError('Sorry, this event has reached capacity.');return;} if(registrations.some(r=>r.eventId===selected.id&&(r.studentId.toLowerCase()===studentId.toLowerCase()||r.email===email))){setFormError('This student ID or email is already registered for this event.');return;} setRegistrations(old=>[...old,{id:`reg-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,eventId:selected.id,studentId,name,email,department:form.department,createdAt:new Date().toISOString()}]);setSelected(null);setToast('Registration confirmed. See you at the event!'); }
 function cancelRegistration(reg) { const event=events.find(e=>e.id===reg.eventId);if(!event?.cancelAllowed)return;if(window.confirm(`Cancel your registration for “${event.title}”?`)){setRegistrations(old=>old.filter(r=>r.id!==reg.id));setToast('Registration cancelled. The seat is available again.');} }
 return <div className="app-shell">
  <header className="topbar"><div className="nav container"><button className="brand" onClick={()=>setPage('events')}><span className="brand-icon"><GraduationCap size={22}/></span><span>Campus<span className="brand-accent">Connect</span><small>COLLEGE EVENTS</small></span></button><nav><button className={page==='events'?'nav-link active':'nav-link'} onClick={()=>setPage('events')}>Explore events</button><button className={page==='registrations'?'nav-link active':'nav-link'} onClick={()=>setPage('registrations')}>My registrations <span className="nav-count">{registrations.length}</span></button></nav><div className="student-chip"><span className="avatar">S</span><span>Student portal</span></div></div></header>
  <main className="container main-content">
   <section className="hero"><div className="hero-copy"><div className="eyebrow"><Sparkles size={14}/> YOUR CAMPUS, YOUR COMMUNITY</div><h1>Make campus life<br/><span>more memorable.</span></h1><p>Discover workshops, festivals, competitions, and student meetups. Find your next experience and reserve your place.</p><button className="hero-cta" onClick={()=>document.getElementById('event-list')?.scrollIntoView({behavior:'smooth'})}>Explore upcoming events <ArrowUpRight size={17}/></button></div><div className="hero-art" aria-hidden="true"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-card"><CalendarDays size={34}/><b>Make it<br/>happen.</b><span>YOUR NEXT CHAPTER</span></div><span className="float-dot dot-one">✦</span><span className="float-dot dot-two">✳</span><span className="float-dot dot-three">✦</span></div><div className="hero-bottom"><span><span className="live-dot"/> Discover what's happening</span><span>Built for student life <ChevronRight size={15}/></span></div></section>
   <section className="stats-grid"><div className="stat-card"><span className="stat-icon blue"><CalendarDays size={19}/></span><div><small>Upcoming events</small><strong>{upcomingCount}</strong></div><span className="stat-note">On campus</span></div><div className="stat-card"><span className="stat-icon purple"><Ticket size={19}/></span><div><small>Your registrations</small><strong>{registrations.length}</strong></div><span className="stat-note">Your event passes</span></div><div className="stat-card"><span className="stat-icon green"><Users size={19}/></span><div><small>Total seats reserved</small><strong>{registrations.length}</strong></div><span className="stat-note">Across all events</span></div></section>
   {page==='events'?<section id="event-list" className="event-section"><div className="section-heading"><div><div className="section-kicker">FIND YOUR NEXT EXPERIENCE</div><h2>Explore events <span className="heading-count">{filtered.length}</span></h2><p>From big ideas to unforgettable moments.</p></div><div className="sort-note"><span className="live-dot"/> Registration is open</div></div>
    <div className="filter-panel"><label className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search events, topics, venues..." aria-label="Search events"/>{query&&<button onClick={()=>setQuery('')} aria-label="Clear search"><X size={15}/></button>}</label><label className="select-box"><span>Category</span><select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{['Technology','Arts & Culture','Career','Sports','Workshop'].map(c=><option key={c}>{c}</option>)}</select></label><label className="select-box date-select"><span>Date</span><input type="date" value={date} onChange={e=>setDate(e.target.value)} aria-label="Filter by date"/></label><button className="clear-filters" onClick={()=>{setQuery('');setCategory('');setDate('')}}>Reset</button></div>
    <div className="event-grid">{filtered.length?filtered.map((e,i)=>{const n=countFor(e.id),left=remaining(e),full=isFull(e),pct=Number(e.capacity)>0?Math.min(100,n/Number(e.capacity)*100):0;return <article className="event-card" key={e.id}><div className={`event-art art-${i%4}`}><span className="event-emoji">{e.emoji||'📅'}</span><span className="category-pill">{e.category}</span><span className="art-index">0{i+1}</span></div><div className="event-body"><div className="event-date"><CalendarDays size={14}/>{formatDate(e)} <span className="date-dot">·</span> <Clock3 size={13}/>{formatTime(e)}</div><h3>{e.title}</h3><p className="event-description">{e.description}</p><div className="event-venue"><MapPin size={15}/><span>{e.venue}</span></div><div className="capacity-area"><div className="capacity-label"><span><Users size={13}/> {n} registered</span><span>{left===null?'Open capacity':`${left} seats left`}</span></div><div className="progress-track"><span style={{width:`${pct}%`}}/></div></div><div className="event-actions"><button className="details-btn" onClick={()=>setDetail(e)}>Details <ArrowUpRight size={15}/></button><button className="register-btn" disabled={full} onClick={()=>startRegistration(e)}>{full?'Event full':'Register'} <ChevronRight size={16}/></button></div></div></article>}) : <div className="empty-state"><div className="empty-icon"><Search size={24}/></div><h3>No events found</h3><p>Try another search term or reset your filters.</p><button className="secondary-btn" onClick={()=>{setQuery('');setCategory('');setDate('')}}>Clear all filters</button></div>}</div>
   </section>:<section className="registrations-section"><div className="section-heading"><div><div className="section-kicker">YOUR CAMPUS CALENDAR</div><h2>My registrations</h2><p>All the events you've signed up for, in one place.</p></div><button className="secondary-btn" onClick={()=>setPage('events')}>＋ Explore events</button></div>{registrations.length===0?<div className="empty-state"><div className="empty-icon"><Ticket size={24}/></div><h3>Your next memory starts here.</h3><p>You haven't registered for any events yet. Explore what's happening on campus.</p><button className="primary-btn" onClick={()=>setPage('events')}>Explore events <ArrowUpRight size={16}/></button></div>:<div className="registrations-list">{registrations.slice().sort((a,b)=>a.createdAt.localeCompare(b.createdAt)).map(r=>{const e=events.find(x=>x.id===r.eventId);if(!e)return null;return <article className="registration-row" key={r.id}><div className="reg-date"><strong>{new Date(e.date+'T12:00:00').toLocaleDateString('en-IN',{day:'2-digit'})}</strong><span>{new Date(e.date+'T12:00:00').toLocaleDateString('en-IN',{month:'short'}).toUpperCase()}</span></div><div className="reg-info"><h3>{e.title}</h3><p><CalendarDays size={14}/>{formatDate(e)} · {formatTime(e)}</p><p><MapPin size={14}/>{e.venue}</p><small>{r.name} · {r.email}</small></div><div className="reg-status"><span><CheckCircle2 size={14}/> Registered</span>{e.cancelAllowed?<button className="cancel-btn" onClick={()=>cancelRegistration(r)}>Cancel registration</button>:<small>Cancellation unavailable</small>}</div></article>})}</div>}</section>}
   <footer className="footer"><span className="footer-brand"><GraduationCap size={18}/> CampusConnect</span><span>Make the most of your campus experience.</span><span>© 2026 CampusConnect</span></footer>
  </main>
  {(selected||detail)&&<div className="modal-overlay" onMouseDown={e=>{if(e.target===e.currentTarget){setSelected(null);setDetail(null)}}}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-top"><div className="modal-symbol">{selected?<Ticket size={22}/>:<CalendarDays size={22}/>}</div><button className="modal-close" onClick={()=>{setSelected(null);setDetail(null)}} aria-label="Close"><X size={19}/></button></div>{selected?<><div className="modal-heading"><span className="section-kicker">SAVE YOUR SPOT</span><h2 id="modal-title">Register for {selected.title}</h2><p>{formatDate(selected)} · {formatTime(selected)} · {selected.venue}</p></div><form onSubmit={submitRegistration} className="registration-form"><div className="form-grid"><label>Full name *<input required maxLength={80} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your full name"/></label><label>Student ID *<input required maxLength={30} value={form.studentId} onChange={e=>setForm({...form,studentId:e.target.value})} placeholder="e.g. 23IT104"/></label><label className="form-full">College email *<input required type="email" maxLength={120} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label className="form-full">Department *<select required value={form.department} onChange={e=>setForm({...form,department:e.target.value})}><option value="">Select department</option>{['Information Technology','Computer Science','Electronics & Communication','Electrical Engineering','Mechanical Engineering','Civil Engineering','Business Administration','Other'].map(d=><option key={d}>{d}</option>)}</select></label></div>{formError&&<p className="form-error" role="alert">{formError}</p>}<div className="modal-actions"><button type="button" className="secondary-btn" onClick={()=>setSelected(null)}>Cancel</button><button type="submit" className="primary-btn">Confirm registration <ArrowUpRight size={16}/></button></div><p className="privacy-note">Your registration is saved locally in this browser for this demo.</p></form></>:<><div className="modal-heading"><span className="category-pill inline-pill">{detail.category}</span><h2 id="modal-title">{detail.title}</h2><p>{detail.description}</p></div><div className="detail-facts"><div><CalendarDays size={17}/><span><small>Date & time</small><strong>{formatDate(detail)} · {formatTime(detail)}</strong></span></div><div><MapPin size={17}/><span><small>Venue</small><strong>{detail.venue}</strong></span></div><div><Users size={17}/><span><small>Registration</small><strong>{countFor(detail.id)} registered{remaining(detail)!==null?` · ${remaining(detail)} seats left`:''}</strong></span></div></div><div className="modal-actions"><button className="secondary-btn" onClick={()=>setDetail(null)}>Close</button><button className="primary-btn" disabled={isFull(detail)} onClick={()=>{const e=detail;setDetail(null);startRegistration(e)}}>{isFull(detail)?'Event full':'Register now'} <ArrowUpRight size={16}/></button></div></>}</section></div>}
  {toast&&<div className="toast" role="status"><CheckCircle2 size={18}/>{toast}<button onClick={()=>setToast('')} aria-label="Dismiss"><X size={16}/></button></div>}
 </div>;
}
