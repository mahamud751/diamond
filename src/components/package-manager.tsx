"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { removePackage, savePackage } from "@/actions/admin";
import { Field } from "@/components/field";
import { Gem, Arrow } from "@/components/gem";
import { bdtToUsd, rateLabel, taka, usd } from "@/lib/format";

export type CatalogPackage = {
  id: string; name: string; diamonds: number; priceBdt: number; priceUsd: number;
  description: string; active: boolean; highlight: boolean; sortOrder: number; orders: number;
};

function Icon({ name }: { name: "plus" | "search" | "edit" | "box" | "check" | "star" | "eye" | "close" | "trash" }) {
  const paths = { plus: <path d="M12 5v14M5 12h14"/>, search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>, edit: <><path d="M4 20h4l11-11-4-4L4 16z"/><path d="m13 5 4 4"/></>, box: <><path d="m12 3 9 5-9 5-9-5zM3 8v9l9 5 9-5V8M12 13v9M7 5.8l9 5"/></>, check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>, star: <path d="m12 3 2.8 5.7 6.3.9-4.5 4.4 1.1 6.2-5.7-3-5.7 3 1.1-6.2-4.5-4.4 6.3-.9z"/>, eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>, close: <path d="m6 6 12 12M6 18 18 6"/>, trash: <><path d="M4 7h16"/><path d="M9 7V5h6v2"/><path d="M7 7l1 13h8l1-13"/></> };
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function PackageManager({ packages, usdRate }: { packages: CatalogPackage[]; usdRate: number }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("display");
  const [editor, setEditor] = useState<CatalogPackage | "new" | null>(null);
  const [removeOnOpen, setRemoveOnOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const live = packages.filter(item => item.active).length;
  const featured = packages.filter(item => item.highlight).length;
  const filtered = packages.filter(item => {
    const matches = `${item.name} ${item.diamonds}`.toLowerCase().replace(/,/g, "").includes(query.trim().toLowerCase().replace(/,/g, ""));
    return matches && (filter === "all" || (filter === "live" && item.active) || (filter === "hidden" && !item.active) || (filter === "featured" && item.highlight));
  }).sort((a,b) => sort === "price" ? a.priceBdt - b.priceBdt : sort === "diamonds" ? a.diamonds - b.diamonds : a.sortOrder - b.sortOrder);
  function openEditor(value: CatalogPackage | "new", remove = false) { setNotice(""); setRemoveOnOpen(remove && value !== "new"); setEditor(value); }
  return <div className="pkg-workspace">
    <div className="pkg-breadcrumb">Family desk <span>/</span> Catalog <span>/</span> <b>Packages</b></div>
    <div className="pkg-page-heading"><div><p className="pkg-overline">YOUR DIAMOND CATALOG</p><h1>Small packages.<br className="pkg-mobile-break"/> Big possibilities<span>.</span></h1><p>Manage your diamonds, set your prices, and keep the good connections going.</p></div><button className="btn pkg-primary" onClick={() => openEditor("new")}><Icon name="plus"/> Add package</button></div>
    <div className="pkg-stats">
      {[{ label: "Total packages", value: packages.length, note: "In your catalog", icon: "box" as const }, { label: "Live packages", value: live, note: "Visible to your members", icon: "check" as const }, { label: "Family picks", value: featured, note: "Marked as featured", icon: "star" as const }, { label: "Hidden packages", value: packages.length - live, note: "Saved for another moment", icon: "eye" as const }].map((stat,index) => <article className={`pkg-stat pkg-stat-${index}`} key={stat.label}><div className="pkg-stat-top"><span>{stat.label}</span><span className="pkg-stat-icon"><Icon name={stat.icon}/></span></div><b>{stat.value.toString().padStart(2,"0")}</b><p>{index===1 && <i/>}{stat.note}</p></article>)}
    </div>
    <div className="pkg-catalog">
      <div className="pkg-catalog-heading"><div><h2>Package collection <span>{packages.length}</span></h2><p>A clear view of everything you offer.</p></div><Link href="/packages" target="_blank" className="pkg-preview-link">Preview storefront <Arrow diagonal/></Link></div>
      <div className="pkg-controls"><div className="pkg-tabs" role="group" aria-label="Filter packages">{[["all","All packages",packages.length],["live","Live",live],["featured","Family picks",featured],["hidden","Hidden",packages.length-live]].map(([id,label,count]) => <button key={id} aria-pressed={filter===id} onClick={()=>setFilter(String(id))}>{label}<span>{count}</span></button>)}</div><div className="pkg-search-sort"><label className="pkg-search"><Icon name="search"/><input aria-label="Search packages" placeholder="Search packages…" value={query} onChange={e=>setQuery(e.target.value)}/>{query && <button aria-label="Clear search" onClick={()=>setQuery("")}><Icon name="close"/></button>}</label><select aria-label="Sort packages" value={sort} onChange={e=>setSort(e.target.value)}><option value="display">Display order</option><option value="price">Price: low to high</option><option value="diamonds">Diamond amount</option></select></div></div>
      <div className="pkg-table-wrap"><table className="pkg-table"><thead><tr><th>Package</th><th>Price</th><th>Status</th><th>Orders</th><th>Position</th><th><span className="pkg-sr-only">Actions</span></th></tr></thead><tbody>{filtered.map((item,index)=><tr key={item.id}><td className="pkg-name-cell"><span className={`pkg-gem-icon pkg-gem-tone-${index%3}`}><Gem/></span><div><strong>{item.diamonds.toLocaleString("en-US")} <span>diamonds</span></strong><p>{item.name}{item.highlight && <span className="pkg-featured"><Icon name="star"/> Family pick</span>}</p></div></td><td className="pkg-price-cell"><strong>{taka(item.priceBdt)}</strong><span>≈ {usd(bdtToUsd(item.priceBdt, usdRate))}</span></td><td className="pkg-status-cell"><span className={item.active?"pkg-status is-live":"pkg-status"}><i/>{item.active?"Live":"Hidden"}</span></td><td className="pkg-orders-cell"><span>{item.orders}</span> <small>orders</small></td><td className="pkg-position-cell">#{String(item.sortOrder).padStart(2,"0")}</td><td className="pkg-action-cell"><div className="row-actions"><button className="icon-btn" type="button" onClick={()=>openEditor(item)} aria-label={`Edit ${item.name}`} title="Edit"><Icon name="edit"/></button><button className="icon-btn is-danger" type="button" onClick={()=>openEditor(item, true)} aria-label={`Delete ${item.name}`} title="Delete"><Icon name="trash"/></button></div></td></tr>)}</tbody></table></div>
      {!filtered.length && <div className="pkg-empty"><span><Icon name="search"/></span><h3>{packages.length ? "No packages found" : "Your first package starts here"}</h3><p>{packages.length ? "Try another search or filter to find what you need." : "Add a diamond package and give your members something to explore."}</p><button className="btn btn-line" onClick={()=>packages.length ? (setQuery(""),setFilter("all")) : openEditor("new")}>{packages.length ? "Clear filters" : "Add your first package"}</button></div>}
      <div className="pkg-table-footer"><span>Showing <b>{filtered.length}</b> of <b>{packages.length}</b> packages</span><span><i/> Changes appear on your storefront after saving</span></div>
    </div>
    <div className="pkg-bottom-note"><span className="pkg-note-icon"><Icon name="star"/></span><p><b>A little spotlight goes a long way.</b> Mark a package as a Family pick to feature it in your homepage collection.</p><Link href="/" target="_blank">View homepage <Arrow diagonal/></Link></div>
    <div className="pkg-toast" role="status" aria-live="polite">{notice && <><Icon name="check"/>{notice}<button onClick={()=>setNotice("")} aria-label="Dismiss notification"><Icon name="close"/></button></>}</div>
    {editor && <PackageEditor key={editor === "new" ? "new" : `${editor.id}-${removeOnOpen ? "remove" : "edit"}`} item={editor === "new" ? undefined : editor} usdRate={usdRate} nextPosition={Math.max(0,...packages.map(p=>p.sortOrder))+1} removeFirst={removeOnOpen} onClose={()=>setEditor(null)} onSaved={(message)=>{setNotice(message);setEditor(null);}}/>}
  </div>;
}

function PackageEditor({ item, usdRate, nextPosition, removeFirst = false, onClose, onSaved }: { item?: CatalogPackage; usdRate: number; nextPosition: number; removeFirst?: boolean; onClose: () => void; onSaved: (message: string) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState(savePackage, {});
  const [deleting, startDelete] = useTransition();
  const [confirmRemove, setConfirmRemove] = useState(removeFirst);
  const [removeError, setRemoveError] = useState("");
  const [amount, setAmount] = useState(item?.diamonds ?? 50000);
  const [price, setPrice] = useState(item?.priceBdt ?? 0);
  useEffect(() => { const node=dialog.current; node?.showModal(); const previous=document.body.style.overflow; document.body.style.overflow="hidden"; return ()=>{node?.close();document.body.style.overflow=previous;}; }, []);
  useEffect(() => { if (state.ok) onSaved(state.ok); }, [state, onSaved]);
  const busy = pending || deleting;
  return <dialog ref={dialog} className="pkg-dialog" aria-labelledby="pkg-editor-title" onCancel={event=>{event.preventDefault();if(!busy)onClose();}} onClick={event=>{if(event.target===event.currentTarget&&!busy)onClose();}}><div className="pkg-editor">
    <div className="pkg-editor-header"><div><p className="pkg-overline">{item?"REFINE YOUR COLLECTION":"A NEW POSSIBILITY"}</p><h2 id="pkg-editor-title">{item?"Edit package":"Create a package"}</h2></div><button className="pkg-icon-button" type="button" onClick={onClose} disabled={busy} aria-label="Close package editor"><Icon name="close"/></button></div>
    <div className="pkg-editor-preview"><span className="pkg-editor-gem"><Gem/></span><div><span>CHAMET DIAMONDS</span><h3>{Number(amount||0).toLocaleString("en-US")} diamonds</h3><p>{price ? `${taka(price)} · ${usd(bdtToUsd(price, usdRate))}` : "Set your price below"}</p></div><span className="pkg-preview-badge">Preview</span></div>
    <form action={action} className="pkg-editor-form">
      {item && <input type="hidden" name="id" value={item.id}/>}
      <fieldset disabled={busy} className="pkg-editor-fields"><legend className="pkg-sr-only">Package details</legend>
      <div className="pkg-form-section"><p className="pkg-form-section-title"><span>01</span> Package details</p><Field label="Package name"><input name="name" required maxLength={100} placeholder="e.g. Family 50,000" defaultValue={item?.name}/></Field><div className="pkg-form-grid"><Field label="Diamond amount"><input name="diamonds" type="number" min={1} max={2147483647} required value={amount} onChange={e=>setAmount(Number(e.target.value))}/></Field><Field label="Display position" hint="Lower numbers appear first."><input name="sortOrder" type="number" min={0} max={2147483647} defaultValue={item?.sortOrder ?? nextPosition} required/></Field></div><Field label="Description (optional)"><textarea name="description" placeholder="A short note about this package…" maxLength={1000} defaultValue={item?.description}/></Field></div>
      <div className="pkg-form-section"><p className="pkg-form-section-title"><span>02</span> Pricing</p><div className="pkg-form-grid"><Field label="Price in BDT" hint="The amount your member pays."><div className="pkg-currency-input"><span>৳</span><input name="priceBdt" type="number" min={1} max={2147483647} required placeholder="0" value={price||""} onChange={e=>setPrice(Number(e.target.value))}/><b>BDT</b></div></Field><Field label="Dollar price" hint={`Calculated from the house rate. ${rateLabel(usdRate)}. Change it in House settings.`}><div className="pkg-currency-input"><span>$</span><input readOnly tabIndex={-1} value={price ? bdtToUsd(price, usdRate).toFixed(2) : "0.00"}/><b>USD</b></div></Field></div></div>
      <div className="pkg-form-section"><p className="pkg-form-section-title"><span>03</span> Visibility & featuring</p><label className="pkg-switch-row"><div><b>Live on storefront</b><span>Let members discover and order this package.</span></div><input type="checkbox" name="active" className="pkg-switch" defaultChecked={item?.active ?? true}/></label><label className="pkg-switch-row"><div><b>Feature as a Family pick <Icon name="star"/></b><span>Include this package in your featured collection.</span></div><input type="checkbox" name="highlight" className="pkg-switch" defaultChecked={item?.highlight ?? false}/></label></div>
      </fieldset>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <div className="pkg-editor-actions"><button type="button" className="btn btn-line" onClick={onClose} disabled={busy}>Cancel</button><button className="btn pkg-primary" disabled={busy}>{pending?"Saving…":item?"Save changes":"Create package"}<Arrow/></button></div>
    </form>
    {item && <div className="pkg-remove-area">{confirmRemove?<><p><b>{item.orders ? "Hide this package?" : "Remove this package?"}</b>{item.orders?"It has existing orders, so it will be hidden. Order history stays available.":"This removes it from your catalog. You can cancel to keep it."}</p><div><button className="btn btn-line" onClick={()=>setConfirmRemove(false)} disabled={busy}>Keep package</button><button className="btn pkg-remove-confirm" disabled={busy} onClick={()=>startDelete(async()=>{try { const form=new FormData();form.set("id",item.id);await removePackage(form);onSaved(item.orders?"Package hidden. Existing orders are preserved.":"Package removed."); } catch { setRemoveError("Could not remove this package. Please try again."); }})}>{deleting?"Updating…":item.orders?"Hide package":"Remove package"}</button></div></>:<button className="pkg-remove-link" type="button" disabled={busy} onClick={()=>setConfirmRemove(true)}>{item.orders?"Hide this package":"Remove this package"}</button>}{removeError&&<p className="form-error" role="alert">{removeError}</p>}</div>}
  </div></dialog>;
}
