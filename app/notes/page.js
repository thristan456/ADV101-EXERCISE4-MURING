"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotesPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("noteUser");

    if (!savedEmail) {
      router.replace("/");
      return;
    }

    setEmail(savedEmail);

    try {
      const savedNotes = localStorage.getItem(
        `notes-${savedEmail.trim().toLowerCase()}`
      );

      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);

        if (Array.isArray(parsedNotes)) {
          setNotes(parsedNotes);
        }
      }
    } catch {
      setNotes([]);
    }
  }, [router]);

  useEffect(() => {
    if (!email) return;

    try {
      localStorage.setItem(
        `notes-${email.trim().toLowerCase()}`,
        JSON.stringify(notes)
      );
    } catch {
      // Notes remain available in the current page session.
    }
  }, [notes, email]);

  const filteredNotes = useMemo(() => {
    return notes.filter((item) =>
      item.text.toLowerCase().includes(search.toLowerCase())
    );
  }, [notes, search]);

  const firstName = email
    ? email.split("@")[0].split(/[._-]/)[0]
    : "there";

  function handleAddNote(event) {
    event.preventDefault();

    if (!note.trim()) return;

    const newNote = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text: note.trim(),
      date: new Date().toISOString(),
    };

    setNotes((previousNotes) => [newNote, ...previousNotes]);
    setNote("");
    setActiveView("notes");
    setSearch("");
  }

  function handleDeleteNote(id) {
    setNotes((previousNotes) =>
      previousNotes.filter((item) => item.id !== id)
    );
  }

  function handleLogout() {
    sessionStorage.removeItem("noteUser");
    router.replace("/");
  }

  function formatDate(date) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently added";
    }

    return parsedDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function selectView(view) {
    setActiveView(view);
    setSearch("");

    if (view === "create") {
      document.getElementById("note-editor")?.focus();
    }
  }

  const displayedNotes =
    activeView === "dashboard" && !search
      ? notes.slice(0, 3)
      : filteredNotes;

  return (
    <main className="workspace">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">N</div>

          <div className="brand-copy">
            <h1>Notely</h1>
            <p>YOUR PERSONAL SPACE</p>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${
              activeView === "dashboard" ? "nav-active" : ""
            }`}
            onClick={() => selectView("dashboard")}
          >
            <span className="nav-icon">⌂</span>
            <span>Overview</span>
            {activeView === "dashboard" && (
              <span className="nav-indicator" />
            )}
          </button>

          <button
            className={`nav-item ${
              activeView === "notes" ? "nav-active" : ""
            }`}
            onClick={() => selectView("notes")}
          >
            <span className="nav-icon">▤</span>
            <span>My Notes</span>
            <span className="nav-count">{notes.length}</span>
          </button>

          <button
            className={`nav-item ${
              activeView === "create" ? "nav-active" : ""
            }`}
            onClick={() => selectView("create")}
          >
            <span className="nav-icon">＋</span>
            <span>Create Note</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <div className="tip-symbol">✦</div>
            <h3>A little reminder</h3>
            <p>
              Your ideas deserve a place to grow. Keep writing, one note
              at a time.
            </p>
          </div>

          <div className="sidebar-profile">
            <div className="profile-avatar">
              {email ? email.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="profile-details">
              <strong>{email ? email.split("@")[0] : "Your account"}</strong>
              <span>Personal workspace</span>
            </div>

            <button
              className="profile-logout"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
            >
              ↗
            </button>
          </div>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-divider">/</span>
            <strong>
              {activeView === "dashboard"
                ? "Overview"
                : activeView === "notes"
                  ? "My Notes"
                  : "Create Note"}
            </strong>
          </div>

          <div className="topbar-right">
            <div className="online-status">
              <span className="online-dot" />
              All systems ready
            </div>

            <div className="topbar-avatar">
              {email ? email.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </header>

        <div className="page-content">
          {activeView !== "create" && (
            <section className="hero-banner">
              <div className="hero-content">
                <div className="hero-eyebrow">
                  <span className="hero-sparkle">✦</span>
                  YOUR CREATIVE WORKSPACE
                </div>

                <h2>
                  Good to see you,
                  <br />
                  <span>{firstName}.</span>
                </h2>

                <p>
                  Capture your thoughts, organize your ideas, and make
                  room for what matters.
                </p>

                <button
                  className="hero-button"
                  onClick={() => selectView("create")}
                >
                  <span>＋</span> Create a new note
                </button>
              </div>

              <div className="hero-art" aria-hidden="true">
                <div className="art-orbit orbit-one" />
                <div className="art-orbit orbit-two" />

                <div className="art-card art-card-back">
                  <div className="art-line short" />
                  <div className="art-line" />
                  <div className="art-line medium" />
                </div>

                <div className="art-card art-card-front">
                  <div className="art-card-icon">✦</div>
                  <div className="art-line short" />
                  <div className="art-line" />
                  <div className="art-line medium" />
                  <div className="art-card-footer">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div className="art-floating-star star-one">✧</div>
                <div className="art-floating-star star-two">✦</div>
              </div>

              <div className="hero-decoration hero-decoration-one" />
              <div className="hero-decoration hero-decoration-two" />
            </section>
          )}

          {activeView === "dashboard" && (
            <>
              <section className="section-heading">
                <div>
                  <p className="section-overline">YOUR PROGRESS</p>
                  <h2>Workspace overview</h2>
                  <p className="section-description">
                    Everything you need, organized in one place.
                  </p>
                </div>

                <div className="date-chip">
                  <span>◷</span>
                  {new Date().toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </section>

              <section className="stats-grid">
                <article className="stat-card stat-purple">
                  <div className="stat-top">
                    <div className="stat-icon">▤</div>
                    <span className="stat-badge">YOUR LIBRARY</span>
                  </div>

                  <p className="stat-label">Total notes</p>
                  <div className="stat-value">{notes.length}</div>
                  <p className="stat-foot">
                    {notes.length === 1
                      ? "One idea captured"
                      : "Ideas in your collection"}
                  </p>
                </article>

                <article className="stat-card stat-blue">
                  <div className="stat-top">
                    <div className="stat-icon">✎</div>
                    <span className="stat-badge">THIS SESSION</span>
                  </div>

                  <p className="stat-label">Ready to create</p>
                  <div className="stat-value">∞</div>
                  <p className="stat-foot">Your next idea starts here</p>
                </article>

                <article className="stat-card stat-cyan">
                  <div className="stat-top">
                    <div className="stat-icon">✦</div>
                    <span className="stat-badge">PERSONAL SPACE</span>
                  </div>

                  <p className="stat-label">Workspace status</p>
                  <div className="stat-value stat-status">
                    <span className="status-dot" />
                    Ready
                  </div>
                  <p className="stat-foot">Your workspace is available</p>
                </article>
              </section>
            </>
          )}

          {activeView === "create" && (
            <section className="editor-view">
              <div className="section-heading">
                <div>
                  <p className="section-overline">MAKE SOMETHING GREAT</p>
                  <h2>Create a new note</h2>
                  <p className="section-description">
                    Get your thoughts out of your head and onto the page.
                  </p>
                </div>
              </div>

              <form className="editor-card" onSubmit={handleAddNote}>
                <div className="editor-topline">
                  <span className="editor-document-icon">✎</span>

                  <div>
                    <h3>New note</h3>
                    <p>Your ideas, all in one place.</p>
                  </div>

                  <span className="draft-badge">NEW DRAFT</span>
                </div>

                <label className="editor-label" htmlFor="note-editor">
                  NOTE CONTENT
                </label>

                <textarea
                  id="note-editor"
                  className="note-editor"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Start writing your thoughts here..."
                  rows={9}
                  autoFocus
                />

                <div className="editor-bottom">
                  <span className="character-count">
                    {note.length} characters
                  </span>

                  <div className="editor-actions">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => {
                        setNote("");
                        setActiveView("dashboard");
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="primary-button"
                      disabled={!note.trim()}
                    >
                      Save note <span>↗</span>
                    </button>
                  </div>
                </div>
              </form>
            </section>
          )}

          {activeView !== "create" && (
            <section className="notes-area">
              <div className="notes-toolbar">
                <div>
                  <p className="section-overline">
                    {activeView === "dashboard"
                      ? "YOUR COLLECTION"
                      : "YOUR PERSONAL LIBRARY"}
                  </p>

                  <h2>
                    {activeView === "dashboard"
                      ? "Recent notes"
                      : "All your notes"}
                  </h2>

                  <p className="section-description">
                    {activeView === "dashboard"
                      ? "Your thoughts, always within reach."
                      : "Search, review, and manage your saved ideas."}
                  </p>
                </div>

                <div className="notes-toolbar-actions">
                  <label className="search-box">
                    <span className="search-icon">⌕</span>
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search notes..."
                      aria-label="Search notes"
                    />
                  </label>

                  {activeView === "dashboard" && (
                    <button
                      className="view-all-button"
                      onClick={() => selectView("notes")}
                    >
                      View all <span>→</span>
                    </button>
                  )}
                </div>
              </div>

              {displayedNotes.length === 0 ? (
                <div className="empty-notes">
                  <div className="empty-illustration">
                    <div className="empty-paper">
                      <span>✎</span>
                      <i />
                      <i />
                      <i />
                    </div>

                    <div className="empty-glow" />
                  </div>

                  <h3>
                    {search
                      ? "No matching notes"
                      : "Your next great idea starts here"}
                  </h3>

                  <p>
                    {search
                      ? "Try a different search term."
                      : "Create your first note and give your thoughts a home."}
                  </p>

                  {!search && (
                    <button
                      className="primary-button"
                      onClick={() => selectView("create")}
                    >
                      <span>＋</span> Create your first note
                    </button>
                  )}
                </div>
              ) : (
                <div className="note-grid">
                  {displayedNotes.map((item, index) => (
                    <article
                      className={`premium-note note-color-${index % 4}`}
                      key={item.id}
                    >
                      <div className="note-card-top">
                        <div className="note-type-icon">
                          {index % 4 === 0
                            ? "✦"
                            : index % 4 === 1
                              ? "✎"
                              : index % 4 === 2
                                ? "◇"
                                : "✧"}
                        </div>

                        <button
                          className="note-delete"
                          onClick={() => handleDeleteNote(item.id)}
                          aria-label="Delete note"
                          title="Delete note"
                        >
                          ×
                        </button>
                      </div>

                      <p className="premium-note-text">{item.text}</p>

                      <div className="note-card-footer">
                        <div className="note-date-icon">◷</div>
                        <span>{formatDate(item.date)}</span>
                        <span className="note-saved-indicator" />
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          <footer className="workspace-footer">
            <span>Notely</span>
            <span className="footer-separator">·</span>
            A little space for big ideas.
            <span className="footer-right">Made for your next great thought ✦</span>
          </footer>
        </div>
      </section>
    </main>
  );
}