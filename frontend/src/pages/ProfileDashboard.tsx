import { useState } from 'react'
import { useAuth, type SavedSearch } from '../context/AuthContext'
import type { StudentProfile, ROIResult } from '../types'

interface Props {
  onLoadSearch: (profile: StudentProfile, result: ROIResult) => void
  onBack: () => void
}

export default function ProfileDashboard({ onLoadSearch, onBack }: Props) {
  const { user, logout, deleteSearch } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'settings'>('overview')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  if (!user) return null

  const searches = user.savedSearches || []
  const countries = [...new Set(searches.map(s => s.profile.country))]
  const latestSearch = searches[0]

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const countryFlag: Record<string, string> = {
    Canada: '🇨🇦', UK: '🇬🇧', Australia: '🇦🇺', USA: '🇺🇸',
  }

  return (
    <div className="profile-page">

      {/* PROFILE HEADER */}
      <div className="profile-hero">
        <button className="profile-back-btn" onClick={onBack}>← Back to ROI Oracle</button>
        <div className="profile-hero-inner">
          <div className="profile-avatar-lg">{user.avatar}</div>
          <div className="profile-hero-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            <div className="profile-meta-row">
              <span className="profile-meta-chip">Member since {formatDate(user.joinedAt)}</span>
              <span className="profile-meta-chip">{searches.length} saved {searches.length === 1 ? 'analysis' : 'analyses'}</span>
              {countries.length > 0 && (
                <span className="profile-meta-chip">{countries.map(c => countryFlag[c] || '').join(' ')} {countries.join(', ')}</span>
              )}
            </div>
          </div>
          <button className="btn btn-outline btn-sm profile-logout" onClick={logout}>Sign out</button>
        </div>
      </div>

      {/* TABS */}
      <div className="profile-tabs">
        {(['overview', 'history', 'settings'] as const).map(t => (
          <button
            key={t}
            className={`profile-tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="profile-tab-content">

          {/* QUICK STATS */}
          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <div className="psc-icon orange">R</div>
              <div>
                <div className="psc-val">{searches.length}</div>
                <div className="psc-label">Analyses run</div>
              </div>
            </div>
            <div className="profile-stat-card">
              <div className="psc-icon navy">C</div>
              <div>
                <div className="psc-val">{countries.length}</div>
                <div className="psc-label">Countries explored</div>
              </div>
            </div>
            <div className="profile-stat-card">
              <div className="psc-icon green">U</div>
              <div>
                <div className="psc-val">{[...new Set(searches.map(s => s.profile.city))].length}</div>
                <div className="psc-label">Cities analysed</div>
              </div>
            </div>
          </div>

          {/* LATEST ANALYSIS */}
          {latestSearch ? (
            <div>
              <div className="section-label">Latest analysis</div>
              <div className="profile-latest-card" onClick={() => onLoadSearch(latestSearch.profile, latestSearch.result)}>
                <div className="plc-left">
                  <div className="plc-flag">{countryFlag[latestSearch.profile.country] || '🌍'}</div>
                  <div>
                    <div className="plc-label">{latestSearch.label}</div>
                    <div className="plc-date">{formatDate(latestSearch.createdAt)}</div>
                  </div>
                </div>
                <div className="plc-right">
                  <div className="plc-metric">
                    <span className="plc-metric-val green">{latestSearch.result.pr_probability}%</span>
                    <span className="plc-metric-label">PR prob.</span>
                  </div>
                  <div className="plc-metric">
                    <span className="plc-metric-val orange">Mo. {latestSearch.result.breakeven_month}</span>
                    <span className="plc-metric-label">Breakeven</span>
                  </div>
                  <div className="plc-metric">
                    <span className="plc-metric-val navy">{latestSearch.result.ttj_months}mo</span>
                    <span className="plc-metric-label">Time to job</span>
                  </div>
                  <button className="btn btn-orange btn-sm">Load →</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="profile-empty">
              <div className="profile-empty-icon">📊</div>
              <div className="profile-empty-title">No analyses yet</div>
              <div className="profile-empty-sub">Run your first ROI calculation and it will be saved here automatically.</div>
              <button className="btn btn-orange" style={{ marginTop: 12, width: 'auto', padding: '10px 24px' }} onClick={onBack}>
                Calculate my ROI →
              </button>
            </div>
          )}

          {/* COUNTRIES BREAKDOWN */}
          {searches.length > 0 && (
            <div>
              <div className="section-label">Countries explored</div>
              <div className="country-breakdown">
                {countries.map(c => {
                  const count = searches.filter(s => s.profile.country === c).length
                  const avgBe = Math.round(searches.filter(s => s.profile.country === c).reduce((a, s) => a + s.result.breakeven_month, 0) / count)
                  return (
                    <div key={c} className="country-card">
                      <div className="country-flag">{countryFlag[c] || '🌍'}</div>
                      <div className="country-name">{c}</div>
                      <div className="country-count">{count} {count === 1 ? 'analysis' : 'analyses'}</div>
                      <div className="country-be">Avg breakeven: Mo. {avgBe}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="profile-tab-content">
          <div className="profile-history-header">
            <div className="section-label" style={{ margin: 0 }}>Saved analyses ({searches.length})</div>
          </div>

          {searches.length === 0 ? (
            <div className="profile-empty">
              <div className="profile-empty-icon">📋</div>
              <div className="profile-empty-title">No saved analyses</div>
              <div className="profile-empty-sub">Every ROI calculation you run is automatically saved here.</div>
            </div>
          ) : (
            <div className="history-list">
              {searches.map(s => (
                <div key={s.id} className="history-item">
                  <div className="hi-left">
                    <div className="hi-flag">{countryFlag[s.profile.country] || '🌍'}</div>
                    <div className="hi-info">
                      <div className="hi-title">{s.label}</div>
                      <div className="hi-sub">
                        GPA {s.profile.gpa} · ₹{s.profile.loanLakhs}L loan · {s.profile.experience} exp · {formatDate(s.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="hi-metrics">
                    <div className="hi-metric">
                      <span className="hi-metric-val orange">Mo.{s.result.breakeven_month}</span>
                      <span className="hi-metric-label">Breakeven</span>
                    </div>
                    <div className="hi-metric">
                      <span className="hi-metric-val green">{s.result.pr_probability}%</span>
                      <span className="hi-metric-label">PR</span>
                    </div>
                    <div className="hi-metric">
                      <span className="hi-metric-val">{s.result.ttj_months}mo</span>
                      <span className="hi-metric-label">TTJ</span>
                    </div>
                    <div className="hi-metric">
                      <span className="hi-metric-val green">{s.result.net_roi_yr3}</span>
                      <span className="hi-metric-label">Net ROI</span>
                    </div>
                  </div>
                  <div className="hi-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => onLoadSearch(s.profile, s.result)}>Load</button>
                    {deleteConfirm === s.id ? (
                      <div className="hi-confirm">
                        <span>Delete?</span>
                        <button className="btn-danger-sm" onClick={() => { deleteSearch(s.id); setDeleteConfirm(null) }}>Yes</button>
                        <button className="btn-cancel-sm" onClick={() => setDeleteConfirm(null)}>No</button>
                      </div>
                    ) : (
                      <button className="btn-icon-delete" onClick={() => setDeleteConfirm(s.id)}>✕</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="profile-tab-content">
          <div className="settings-card">
            <div className="section-label">Account details</div>
            <div className="settings-field">
              <div className="settings-field-label">Full name</div>
              <div className="settings-field-val">{user.name}</div>
            </div>
            <div className="settings-field">
              <div className="settings-field-label">Email address</div>
              <div className="settings-field-val">{user.email}</div>
            </div>
            <div className="settings-field">
              <div className="settings-field-label">Member since</div>
              <div className="settings-field-val">{formatDate(user.joinedAt)}</div>
            </div>
            <div className="settings-field">
              <div className="settings-field-label">Saved analyses</div>
              <div className="settings-field-val">{searches.length} / 20</div>
            </div>
          </div>
          <div className="settings-card" style={{ marginTop: 12 }}>
            <div className="section-label">Danger zone</div>
            <div className="settings-danger-row">
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>Sign out of ROI Oracle</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>You can sign back in at any time.</div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={logout}>Sign out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
