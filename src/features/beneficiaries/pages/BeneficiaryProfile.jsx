import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBeneficiaries } from '../../../context/BeneficiariesContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { ChevronLeft, Pencil, FileText, Plus, Close } from '../../../components/icons.jsx';
import DatePicker from '../../../components/ui/DatePicker/index.js';
import styles from './BeneficiaryProfile.module.css';

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const RELATION_OPTIONS = ['Mother', 'Father', 'Guardian', 'Grandparent', 'Sibling', 'Other'];

function initials(b) {
  return `${b.firstName?.[0] ?? ''}${b.lastName?.[0] ?? ''}`.toUpperCase();
}

function fullName(b) {
  return `${b.firstName} ${b.lastName}`.trim();
}

function formatDate(val) {
  if (!val) return '—';
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BeneficiaryProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { beneficiaries, updateBeneficiary, deleteBeneficiary } = useBeneficiaries();
  const { org } = useOrg();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);
  // URLs to keep (user can remove from this list)
  const [keepImageUrls, setKeepImageUrls] = useState([]);
  const [keepDocUrls, setKeepDocUrls] = useState([]);
  // New files picked during this edit session
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [newDocFiles, setNewDocFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);

  const b = beneficiaries.find((x) => x.id === id);
  const programmes = org?.programmes ?? [];

  if (!b) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
            <ChevronLeft size={24} />
          </button>
          <h1 className={styles.title}>Student profile</h1>
        </header>
        <p className={styles.notFound}>Student not found.</p>
      </div>
    );
  }

  const enrolledProgramme = programmes.find((p) => p.id === b.programmeId) ?? null;

  function startEdit() {
    setForm({
      firstName: b.firstName,
      lastName: b.lastName,
      dob: b.dob,
      gender: b.gender,
      address: b.address,
      idNumber: b.idNumber,
      emergencyContactName: b.emergencyContactName,
      emergencyContactDob: b.emergencyContactDob,
      emergencyContactRelation: b.emergencyContactRelation,
      storyQuotes: b.storyQuotes,
      programmeId: b.programmeId ?? '',
    });
    setKeepImageUrls([...(b.storyImageUrls ?? [])]);
    setKeepDocUrls([...(b.documentUrls ?? [])]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setNewDocFiles([]);
    setIsEditing(true);
  }

  function cancelEdit() {
    newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setIsEditing(false);
    setForm(null);
  }

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const updateDate = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  function handleImagesChange(e) {
    const files = Array.from(e.target.files);
    setNewImageFiles((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = '';
  }

  function removeKeepImage(url) {
    setKeepImageUrls((prev) => prev.filter((u) => u !== url));
  }

  function removeNewImage(index) {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function handleDocChange(e) {
    const file = e.target.files[0];
    if (file) setNewDocFiles((prev) => [...prev, file]);
    e.target.value = '';
  }

  function removeKeepDoc(url) {
    setKeepDocUrls((prev) => prev.filter((u) => u !== url));
  }

  function removeNewDoc(index) {
    setNewDocFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    await updateBeneficiary(b.id, {
      ...form,
      programmeId: form.programmeId || null,
      storyImageUrls: keepImageUrls,
      documentUrls: keepDocUrls,
      newImageFiles,
      newDocFiles,
    });
    newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setSaving(false);
    setIsEditing(false);
    setForm(null);
  }

  async function handleDelete() {
    setDeleting(true);
    await deleteBeneficiary(b.id);
    navigate(-1);
  }

  // ── Edit mode ───────────────────────────────────────
  if (isEditing && form) {
    const allDocCount = keepDocUrls.length + newDocFiles.length;
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <button type="button" className={styles.back} onClick={cancelEdit} aria-label="Cancel edit">
            <ChevronLeft size={24} />
          </button>
          <h1 className={styles.title}>Edit profile</h1>
        </header>

        {/* Programme */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Programme</h2>
          <div className={styles.editCard}>
            <div className={styles.editSelectWrap}>
              <select
                className={`${styles.editSelect} ${!form.programmeId ? styles.editPlaceholder : ''}`}
                value={form.programmeId}
                onChange={update('programmeId')}
                aria-label="Linked programme"
              >
                <option value="">No programme</option>
                {programmes.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Personal details */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Personal details</h2>
          <div className={styles.editCard}>
            <input className={styles.editInput} placeholder="First name" value={form.firstName} onChange={update('firstName')} aria-label="First name" />
            <input className={styles.editInput} placeholder="Last name" value={form.lastName} onChange={update('lastName')} aria-label="Last name" />
            <DatePicker label="Date of birth" value={form.dob} onChange={updateDate('dob')} disableFuture />
            <div className={styles.editSelectWrap}>
              <select
                className={`${styles.editSelect} ${!form.gender ? styles.editPlaceholder : ''}`}
                value={form.gender}
                onChange={update('gender')}
                aria-label="Gender"
              >
                <option value="">Gender (optional)</option>
                {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <input className={styles.editInput} placeholder="Address" value={form.address} onChange={update('address')} aria-label="Address" />
            <input className={styles.editInput} placeholder="ID number" value={form.idNumber} onChange={update('idNumber')} aria-label="ID number" inputMode="numeric" />
          </div>
        </section>

        {/* Emergency contact */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Emergency contact</h2>
          <div className={styles.editCard}>
            <input className={styles.editInput} placeholder="Full name" value={form.emergencyContactName} onChange={update('emergencyContactName')} aria-label="Emergency contact name" />
            <DatePicker label="Date of birth (optional)" value={form.emergencyContactDob} onChange={updateDate('emergencyContactDob')} disableFuture />
            <div className={styles.editSelectWrap}>
              <select
                className={`${styles.editSelect} ${!form.emergencyContactRelation ? styles.editPlaceholder : ''}`}
                value={form.emergencyContactRelation}
                onChange={update('emergencyContactRelation')}
                aria-label="Relation"
              >
                <option value="">Relation (optional)</option>
                {RELATION_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Documents */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Forms &amp; consent documents</h2>
          <div className={styles.editCard}>
            {keepDocUrls.map((url, i) => (
              <div key={url} className={`${styles.docEditRow} ${i < keepDocUrls.length - 1 || newDocFiles.length > 0 ? styles.docBorder : ''}`}>
                <span className={styles.docLabel}><FileText size={16} /> Document {i + 1}</span>
                <div className={styles.docActions}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>View</a>
                  <button type="button" className={styles.removeDocBtn} onClick={() => removeKeepDoc(url)} aria-label="Remove document">
                    <Close size={14} />
                  </button>
                </div>
              </div>
            ))}
            {newDocFiles.map((f, i) => (
              <div key={f.name + i} className={`${styles.docEditRow} ${i < newDocFiles.length - 1 ? styles.docBorder : ''}`}>
                <span className={styles.docLabel}><FileText size={16} /> {f.name}</span>
                <button type="button" className={styles.removeDocBtn} onClick={() => removeNewDoc(i)} aria-label="Remove document">
                  <Close size={14} />
                </button>
              </div>
            ))}
            {allDocCount === 0 && <p className={styles.emptyHint}>No documents yet.</p>}
            <button
              type="button"
              className={styles.addDocBtn}
              onClick={() => docInputRef.current?.click()}
            >
              <Plus size={14} /> Add document
            </button>
            <input
              ref={docInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className={styles.fileInputHidden}
              onChange={handleDocChange}
              aria-label="Upload document"
            />
          </div>
        </section>

        {/* Story content */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Story content</h2>
          <div className={styles.editCard}>
            <p className={styles.subLabel}>IMAGES</p>
            <div className={styles.imageGrid}>
              {keepImageUrls.map((url, i) => (
                <div key={url} className={styles.imageThumb}>
                  <img src={url} alt={`Story image ${i + 1}`} className={styles.thumbImg} />
                  <button type="button" className={styles.removeImg} onClick={() => removeKeepImage(url)} aria-label="Remove image">×</button>
                </div>
              ))}
              {newImagePreviews.map((url, i) => (
                <div key={url} className={styles.imageThumb}>
                  <img src={url} alt={`New image ${i + 1}`} className={styles.thumbImg} />
                  <button type="button" className={styles.removeImg} onClick={() => removeNewImage(i)} aria-label="Remove image">×</button>
                </div>
              ))}
              <button type="button" className={styles.addImageBtn} onClick={() => imageInputRef.current?.click()} aria-label="Add image">
                <Plus size={20} />
              </button>
              <input ref={imageInputRef} type="file" accept="image/*" multiple className={styles.fileInputHidden} onChange={handleImagesChange} aria-label="Story images" />
            </div>

            <p className={styles.subLabel}>QUOTES</p>
            <textarea
              className={styles.editTextarea}
              placeholder='e.g. "This programme changed my life."'
              value={form.storyQuotes}
              onChange={update('storyQuotes')}
              aria-label="Story quotes"
              rows={3}
            />
          </div>
        </section>

        {/* Save / Cancel */}
        <div className={styles.actionRow}>
          <button type="button" className={styles.cancelBtn} onClick={cancelEdit} disabled={saving}>
            Cancel
          </button>
          <button type="button" className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>

        {/* Delete student */}
        <div className={styles.deleteZone}>
          {!confirmDelete ? (
            <button type="button" className={styles.dangerBtn} onClick={() => setConfirmDelete(true)}>
              Delete student
            </button>
          ) : (
            <div className={styles.confirmBox}>
              <p className={styles.confirmText}>This will permanently delete the student and all their data. Are you sure?</p>
              <div className={styles.confirmRow}>
                <button type="button" className={styles.cancelBtn} onClick={() => setConfirmDelete(false)} disabled={deleting}>
                  Cancel
                </button>
                <button type="button" className={styles.dangerBtn} onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Deleting…' : 'Yes, delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── View mode ───────────────────────────────────────
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Student profile</h1>
        <button type="button" className={styles.editBtn} onClick={startEdit} aria-label="Edit profile">
          <Pencil size={16} /> Edit
        </button>
      </header>

      {/* Identity card */}
      <div className={styles.card}>
        <span className={styles.avatar} aria-hidden="true">{initials(b)}</span>
        <div className={styles.identityBody}>
          <p className={styles.name}>{fullName(b)}</p>
          {b.status && <p className={styles.status}>{b.status}</p>}
        </div>
      </div>

      {/* Enrolled programs */}
      {enrolledProgramme && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Enrolled programs</h2>
          <div className={styles.pillRow}>
            <span
              className={styles.programmePill}
              style={{
                background: enrolledProgramme.color ? `${enrolledProgramme.color}22` : undefined,
                color: enrolledProgramme.color ?? undefined,
              }}
            >
              {enrolledProgramme.name}
            </span>
          </div>
          <div className={styles.programmeCard}>
            <div className={styles.programmeCardHeader}>
              <span
                className={styles.programmeAvatar}
                style={{ background: enrolledProgramme.color ?? 'var(--color-primary)' }}
              >
                {enrolledProgramme.shortLabel || enrolledProgramme.name.slice(0, 3).toUpperCase()}
              </span>
              <div>
                <p className={styles.programmeName}>{enrolledProgramme.name}</p>
                {enrolledProgramme.description && (
                  <p className={styles.programmeDesc}>{enrolledProgramme.description}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Personal details */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Personal details</h2>
        <div className={styles.detailCard}>
          <DetailRow label="Date of birth" value={formatDate(b.dob)} />
          <DetailRow label="Gender" value={b.gender || '—'} />
          <DetailRow label="Address" value={b.address || '—'} />
          <DetailRow label="ID number" value={b.idNumber || '—'} last />
        </div>
      </section>

      {/* Emergency contact */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Emergency contact</h2>
        <div className={styles.detailCard}>
          <DetailRow label="Name" value={b.emergencyContactName || '—'} />
          <DetailRow label="Date of birth" value={formatDate(b.emergencyContactDob)} />
          <DetailRow label="Relation" value={b.emergencyContactRelation || '—'} last />
        </div>
      </section>

      {/* Documents */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Forms &amp; consent documents</h2>
        <div className={styles.detailCard}>
          {(b.documentUrls ?? []).length === 0 ? (
            <p className={styles.emptyHint}>No documents uploaded.</p>
          ) : (
            (b.documentUrls ?? []).map((url, i) => (
              <div key={url} className={`${styles.docRow} ${i < (b.documentUrls.length - 1) ? styles.docBorder : ''}`}>
                <span className={styles.docLabel}><FileText size={16} /> Document {i + 1}</span>
                <a href={url} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>View PDF</a>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Story content */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Story content</h2>
        <div className={styles.detailCard}>
          <p className={styles.subLabel}>IMAGES</p>
          <div className={styles.imageGrid}>
            {(b.storyImageUrls ?? []).map((url, i) => (
              <div key={url} className={styles.imageThumb}>
                <img src={url} alt={`Story image ${i + 1}`} className={styles.thumbImg} />
              </div>
            ))}
            {(b.storyImageUrls ?? []).length === 0 && (
              <p className={styles.emptyHintInline}>No images yet — tap Edit to add some.</p>
            )}
          </div>
          <p className={styles.subLabel}>QUOTES</p>
          {b.storyQuotes
            ? <p className={styles.quoteText}>"{b.storyQuotes}"</p>
            : <p className={styles.emptyHint}>No quotes yet.</p>
          }
        </div>
      </section>
    </div>
  );
}

function DetailRow({ label, value, last }) {
  return (
    <div className={`${styles.detailRow} ${last ? '' : styles.detailBorder}`}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}
