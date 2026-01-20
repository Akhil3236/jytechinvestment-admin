import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";

export default function Tax() {
  const [taxList, setTaxList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  /* ---------------- FETCH TAX CONFIG ---------------- */
  useEffect(() => {
    fetchTaxConfig();
  }, []);

  const fetchTaxConfig = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        "https://api.emibocquillon.fr/admin/tax/config",
        authConfig,
      );

      const config = res.data.config;
      setTaxList([
        {
          key: "tvaIntegrale",
          name: "TVA Intégrale",
          value: config.vatRates.tvaIntegrale,
        },
        {
          key: "tvaSurMarge",
          name: "TVA sur Marge",
          value: config.vatRates.tvaSurMarge,
        },
        {
          key: "exonereDeTva",
          name: "Exonéré de TVA",
          value: config.vatRates.exonereDeTva,
        },
        {
          key: "standardMarginRate",
          name: "Standard Margin Rate",
          value: config.standardMarginRate,
          // hidden: true, // not rendered in table
        },
      ]);
    } catch (err) {
      console.error(err);
      setError("Failed to load tax configuration");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HANDLE INPUT CHANGE ---------------- */
  const handleRateChange = (key, newValue) => {
    setTaxList((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, value: newValue } : item,
      ),
    );
  };

  /* ---------------- SUBMIT UPDATED CONFIG ---------------- */
  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError("");

      const payload = {
        tvaIntegrale: Number(
          taxList.find((t) => t.key === "tvaIntegrale")?.value || 0,
        ),
        tvaSurMarge: Number(
          taxList.find((t) => t.key === "tvaSurMarge")?.value || 0,
        ),
        exonereDeTva: Number(
          taxList.find((t) => t.key === "exonereDeTva")?.value || 0,
        ),
        standardMarginRate: Number(
          taxList.find((t) => t.key === "standardMarginRate")?.value || 0,
        ),
      };

      const res = await axios.put(
        "https://api.emibocquillon.fr/admin/tax/config",
        payload,
        authConfig,
      );

      const updatedConfig = res.data.config;

      // Sync UI with backend-confirmed values
      setTaxList([
        {
          key: "tvaIntegrale",
          name: "TVA Intégrale",
          value: updatedConfig.tvaIntegrale,
        },
        {
          key: "tvaSurMarge",
          name: "TVA sur Marge",
          value: updatedConfig.tvaSurMarge,
        },
        {
          key: "exonereDeTva",
          name: "Exonéré de TVA",
          value: updatedConfig.exonereDeTva,
        },
        {
          key: "standardMarginRate",
          name: "Standard Margin Rate",
          value: updatedConfig.standardMarginRate,
        },
      ]);

      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to update tax configuration");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- UI STATES ---------------- */
  if (loading) {
    return (
      <div>
        <Navbar heading="Tax Management" />
        <div className="p-10 text-center text-gray-500">
          Loading tax configuration...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar heading="Tax Management" />
        <div className="p-10 text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar heading="Tax Management" />

      <div className="p-6 mt-5 bg-gray-50 min-h-screen">
        {/* TAX TABLE */}
        <div className="bg-white border border-gray-300 rounded-xl shadow-sm px-2 max-w-7xl">
          <table className="w-full  text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-600">
              <tr className="border-b border-b-gray-400">
                <th className="px-6 py-4 text-left">TVA Name</th>
                <th className="px-6 py-4 text-left">Tax value (%)</th>
              </tr>
            </thead>

            <tbody>
              {taxList.map((tax) => (
                <tr key={tax.key}>
                  <td className="px-6 py-4 font-medium">{tax.name}</td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min="0"
                      value={tax.value}
                      onChange={(e) =>
                        handleRateChange(tax.key, e.target.value)
                      }
                      className="w-28 px-3 py-1 border border-gray-400 mx-2 rounded-md"
                    />
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="max-w-7xl flex justify-end mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 bg-green-900 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
