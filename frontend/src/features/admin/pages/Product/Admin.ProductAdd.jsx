import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProductAdd() {
  const [data, setData] = useState({
    Name: "",
    Kategorie: "",
    Beschreibung: "",
    Bild: "",
    Preis_netto: "",
    Preis_brutto: "",
    Details: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const ac = new AbortController();

    async function loadCategories() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(
          `${process.env.BACKEND_URL}/api/admin/products/categories`,
          {
            credentials: "include",
            signal: ac.signal,
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        setCategories(json.data ?? []);
      } catch (e) {
        if (e.name !== "AbortError")
          setErr("Kategorien konnten nicht geladen werden");
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
    return () => ac.abort();
  }, []);

  const handleSave = async () => {
    const payload = {
      Name: (data.Name || "").trim(),
      Kategorie: (data.Kategorie || "").trim(),
      Beschreibung: (data.Beschreibung || "").trim(),
      Preis_netto: data.Preis_netto ? Number(data.Preis_netto) : null,
      Preis_brutto: data.Preis_brutto ? Number(data.Preis_brutto) : null,
      Bild: data.Bild || null,
      Details: data.Details ?? null,
    };

    setLoading(true);
    setErr("");

    if (
      !payload.Beschreibung ||
      !payload.Bild ||
      !payload.Details ||
      !payload.Kategorie ||
      !payload.Name ||
      !payload.Preis_brutto ||
      !payload.Preis_netto
    ) {
      toast.error("Bitte alle Felder ausfüllen");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.BACKEND_URL}/api/admin/products/save`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const j = await res.json();
          if (j?.message) msg = j.message;
        } catch {}
        throw new Error(msg);
      }

      toast.success("Neues Produkt wurde erfolgreich erstellt");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      setErr("Produkt konnte nicht erstellt werden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="mx-2 mt-1 h-[3px] bg-gray-400 rounded-full animate-pulse" />
        </div>
      ) : (
        <>
          <ArrowLeft
            className="cursor-pointer"
            onClick={() => navigate("/admin/products")}
          />

          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            {/* Basisdaten */}
            <div className="border rounded-lg p-4 space-y-4">
              <h2 className="font-semibold text-lg">Allgemein</h2>

              <label className="flex flex-col">
                <span className="font-medium">Name</span>
                <input
                  className="border rounded px-3 py-2"
                  value={data.Name}
                  onChange={(e) => setData({ ...data, Name: e.target.value })}
                />
              </label>

              <label className="flex flex-col">
                <span className="font-medium">Kategorie</span>
                <select
                  className="border rounded px-3 py-2 bg-white"
                  value={data.Kategorie ?? ""}
                  onChange={(e) =>
                    setData({ ...data, Kategorie: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Bitte Kategorie wählen
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col">
                <span className="font-medium">Beschreibung</span>
                <textarea
                  className="border rounded px-3 py-2"
                  rows={3}
                  value={data.Beschreibung}
                  onChange={(e) =>
                    setData({ ...data, Beschreibung: e.target.value })
                  }
                />
              </label>
            </div>

            {/* Preise & Zusatzinfos */}
            <div className="border rounded-lg p-4 space-y-4">
              <h2 className="font-semibold text-lg">Details</h2>

              <label className="flex flex-col">
                <span className="font-medium">Preis netto</span>
                <input
                  type="number"
                  step="0.01"
                  className="border rounded px-3 py-2"
                  value={data.Preis_netto}
                  onChange={(e) =>
                    setData({ ...data, Preis_netto: e.target.value })
                  }
                />
              </label>

              <label className="flex flex-col">
                <span className="font-medium">Preis brutto</span>
                <input
                  type="number"
                  step="0.01"
                  className="border rounded px-3 py-2"
                  value={data.Preis_brutto}
                  onChange={(e) =>
                    setData({ ...data, Preis_brutto: e.target.value })
                  }
                />
              </label>

              <label className="flex flex-col">
                <span className="font-medium">Bild-URL</span>
                <input
                  className="border rounded px-3 py-2"
                  value={data.Bild}
                  onChange={(e) => setData({ ...data, Bild: e.target.value })}
                />
              </label>

              <label className="flex flex-col">
                <span className="font-medium">Details</span>
                <textarea
                  className="border rounded px-3 py-2"
                  rows={3}
                  value={data.Details}
                  onChange={(e) =>
                    setData({ ...data, Details: e.target.value })
                  }
                />
              </label>
            </div>

            {/* Aktionen */}
            <div className="flex gap-3">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleSave}
              >
                Produkt erstellen
              </button>
              <button
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                onClick={() => navigate("/admin/products")}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
