import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProduktDetail() {
  const { id } = useParams();
  const [data, setData] = useState({
    Name: "",
    Kategorie: "",
    Beschreibung: "",
    Preis_netto: "",
    Preis_brutto: "",
    Bild: "",
    Details: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      console.log("Keine Id gefundenn");
    }

    async function loadProduct() {
      setLoading(true);
      setErr("");

      try {
        const res = await fetch(
          `${process.env.BACKEND_URL}/api/admin/products/${id}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json.data);
      } catch (e) {
        if (e.name !== "AbortError") setErr("Konnte Produkte nicht laden");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const handleSave = async () => {
    if (!id) {
      console.log("Keine id gefunden");
    }

    const payload = {
      Name: data.Name?.trim(),
      Kategorie: data.Kategorie?.trim(),
      Beschreibung: data.Beschreibung?.trim(),
      Preis_netto: Number(data.Preis_netto) || 0,
      Preis_brutto: Number(data.Preis_brutto) || 0,
      Bild: data.Bild,
      Details: data.Details,
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
        `${process.env.BACKEND_URL}/api/admin/products/edit/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      if (res.ok) {
        const data = await res.json();
        toast.success("Produkt wurde erfolgreich gespeichert");
        navigate("/admin");
      }
    } catch (error) {
      console.error(error);
      setErr("Produkt konnte nicht gespeichert werden");
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
                <span className="font-medium">ID</span>
                <input
                  className="border rounded px-3 py-2 bg-gray-100"
                  value={data.idProdukt}
                  disabled
                />
              </label>

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
                <input
                  className="border rounded px-3 py-2"
                  value={data.Kategorie}
                  onChange={(e) =>
                    setData({ ...data, Kategorie: e.target.value })
                  }
                  disabled
                />
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
                <span className="font-medium">
                  Details format:
                  <br />
                  {"{"}"Überschrift":"Wert","Überschrift 2":"Wert 2"{"}"}
                </span>
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
                Speichern
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
