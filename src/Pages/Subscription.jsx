import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";

export default function Subscription() {
  const [activeTab, setActiveTab] = useState("plus");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  /* ================= PLUS PLAN STATE (UNCHANGED) ================= */
  const [planName, setPlanName] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [annualPrice, setAnnualPrice] = useState("");
   const [actualPrice, setActualPrice] = useState("");
  const [description, setDescription] = useState("");
  const [interval, setInterval] = useState("");
  const [currency, setCurrency] = useState("");
  const [type, setType] = useState("");
  const [features, setFeatures] = useState([""]);
  const [isActive, setIsActive] = useState(true);

  /* ================= FREE PLAN STATE ================= */
  const [freePlanName, setFreePlanName] = useState("Free Plan");
  const [freeDescription, setFreeDescription] = useState("");
  const [freeIsActive, setFreeIsActive] = useState(true);

 useEffect(() => {
  const fetchPlans = async () => {
    try {
      const res = await axios.get(
        "https://api.emibocquillon.fr/api/admin/get-all",
        authConfig
      );

      const plans = res.data;

      const freePlan = plans.find((p) => p.type === "basic");
      const plusPlan = plans.find((p) => p.type === "premium");

      /* ================= PREFILL FREE PLAN ================= */
      if (freePlan) {
        setFreePlanName(freePlan.name || "Free Plan");
        setFreeDescription(freePlan.description || "");
        setFreeIsActive(freePlan.isActive ?? true);
        setFeatures(freePlan.features?.length ? freePlan.features : [""]);
      }

      /* ================= PREFILL PLUS PLAN ================= */
      if (plusPlan) {
        setPlanName(plusPlan.name || "");
        setType(plusPlan.type || "");
        setCurrency(plusPlan.currency || "");
        setDescription(plusPlan.description || "");
        setIsActive(plusPlan.isActive ?? true);
        setFeatures(plusPlan.features?.length ? plusPlan.features : [""]);

        const monthly = plusPlan.prices.find(
          (p) => p.durationMonths === 1
        );
        const yearly = plusPlan.prices.find(
          (p) => p.durationMonths === 12
        );

        setMonthlyPrice(monthly?.price ?? "");
        setAnnualPrice(yearly?.price ?? "");
        setActualPrice(yearly?.actualPrice ?? "")

      }
    } catch (error) {
      console.error("Failed to fetch plans", error);
    }
  };

  fetchPlans();
}, []);



  // feature row
  const handleFeatureChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const addFeatureField = () => {
    setFeatures([...features, ""]);
  };

  const removeFeatureField = (index) => {
    const updated = features.filter((_, i) => i !== index);
    setFeatures(updated);
  };

  /* ================= SAVE HANDLERS plus plan================= */
  const handleSavePlus = async () => {
  setLoading(true);

  const payload = {
    name: planName,
    type: "premium",
    currency: currency.toLowerCase(), // "eur"
    description,
    // isPopular: true, // or manage via toggle if needed
    isActive,
    features: features.filter(Boolean),
    prices: [
  {
    durationMonths: 1,
    price: Number(monthlyPrice),
    label: "Monthly",
  },
  {
    durationMonths: 12,
    price: Number(annualPrice), // discounted price
    actualPrice: Number(actualPrice), // original price
    label: "Yearly",
  },
],

  };

  try {
    await axios.put(
      "https://api.emibocquillon.fr/api/admin/edit/696753c2f2bf8d805e0e7699",
      payload,
      authConfig
    );

    alert("Plus plan saved successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to save Plus plan");
  } finally {
    setLoading(false);
  }
};

// free plan
 const handleSaveFree = async () => {
  setLoading(true);

  const payload = {
    name: freePlanName,
    type: "basic", // must match backend discriminator
    currency: "eur", // required by plan schema
    description: freeDescription,
    isActive: freeIsActive,
    features: features.filter(Boolean),

    prices: [
      {
        durationMonths: 0, // lifetime / free
        price: 0,
        label: "Free",
      },
    ],
  };

  try {
    await axios.put(
      "https://api.emibocquillon.fr/api/admin/edit/69675444f2bf8d805e0e769d",
      payload,
      authConfig
    );

    alert("Free plan saved successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to save Free plan");
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <Navbar heading="Gestion des abonnements" />

      <div className="p-8 mt-5 bg-gray-50 min-h-screen">
        {/* ================= TABS ================= */}
        <div className="flex gap-6 mb-6 border-b border-b-gray-300">
          <button
            onClick={() => setActiveTab("plus")}
            className={`pb-2 text-sm font-medium border-b-2 ${
              activeTab === "plus"
                ? "border-emerald-900 text-emerald-900"
                : "border-transparent text-gray-500"
            }`}
          >
            Offre Plus
          </button>

          <button
            onClick={() => setActiveTab("free")}
            className={`pb-2 text-sm font-medium border-b-2 ${
              activeTab === "free"
                ? "border-emerald-900 text-emerald-900"
                : "border-transparent text-gray-500"
            }`}
          >
            Offre Gratuite
          </button>
        </div>

        {/* ================= PLUS PLAN FORM (ORIGINAL) ================= */}
        {activeTab === "plus" && (
          <>
            <h1 className="text-xl font-semibold mb-6">Modifier l’offre Plus </h1>

            <div className="bg-white rounded-xl shadow-sm p-6 max-w-5xl">
              <h2 className="text-lg font-semibold mb-6">Informations de l’offre </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm mb-2">Nom de l’offre</label>
                  <input
                    value={planName}
                    placeholder="Plus plan"
                    onChange={(e) => setPlanName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-400 rounded-lg px-4 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Type d’offre</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={type}
                      placeholder="premium"
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-400 rounded-lg pl-4 pr-4 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Prix mensuel </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      €
                    </span>
                    <input
                      type="number"
                      value={monthlyPrice}
                      placeholder="15"
                      onChange={(e) => setMonthlyPrice(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-400 rounded-lg pl-8 pr-4 py-2 text-sm"
                    />
                  </div>
                </div>

                   <div>
                  <label className="block text-sm mb-2">Prix annuel standard </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      €
                    </span>
                    <input
                      type="number"
                      value={actualPrice}
                      placeholder="0"
                      onChange={(e) => setActualPrice(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-400 rounded-lg pl-8 pr-4 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Prix annuel remisé</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      €
                    </span>
                    <input
                      type="number"
                      value={annualPrice}
                      placeholder="0"
                      onChange={(e) => setAnnualPrice(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-400 rounded-lg pl-8 pr-4 py-2 text-sm"
                    />
                  </div>
                </div>

              

                <div>
                  <label className="block text-sm mb-2">Devise </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      €
                    </span>
                    <input
                      type="text"
                      value={currency}
                      placeholder="Euro"
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-400 rounded-lg pl-8 pr-4 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* feature */}
                <div className="md:col-span-3">
                  <label className="block text-sm mb-2">Fonctionnalités </label>

                  {features.map((item, index) => (
                    <div key={index} className="flex gap-3 mb-3">
                      <input
                        type="text"
                        value={item}
                        placeholder={`Feature ${index + 1}`}
                        onChange={(e) =>
                          handleFeatureChange(index, e.target.value)
                        }
                        className="flex-1 bg-gray-50 border border-gray-400 rounded-lg px-4 py-2 text-sm"
                      />

                      {features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureField(index)}
                          className="px-3 text-sm border rounded-lg text-red-600"
                        >
                          Supprimer 
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addFeatureField}
                    className="mt-2 text-sm text-emerald-900 font-medium"
                  >
                    + Ajouter une fonctionnalité
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm mb-2">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  placeholder="Everything in Basic"
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-400 rounded-lg px-4 py-3 text-sm resize-none"
                />
                <p className="text-sm text-gray-700 mt-2">
                  Cette description apparaît sur la carte tarifaire 
                </p>
              </div>

              <hr className="my-6" />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Statut de l’offre</h3>
                  <p className="text-xs text-gray-600">
                    Activer pour masquer cette offre de la page de tarification
                  </p>
                </div>

                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    isActive ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 bg-white rounded-full transition transform ${
                      isActive ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button className="px-6 py-2 border rounded-full text-sm">
                  Annuler
                </button>

                <button
                  disabled={loading}
                  onClick={handleSavePlus}
                  className="px-6 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-full text-sm disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Enregistrer les modifications"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ================= FREE PLAN FORM (SAME STRUCTURE) ================= */}
        {activeTab === "free" && (
          <>
            <h1 className="text-xl font-semibold mb-6">Modifier le forfait gratuit</h1>

            <div className="bg-white rounded-xl shadow-sm p-6 max-w-5xl">
              <h2 className="text-lg font-semibold mb-6">Informations sur le plan</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm mb-2">Nom du plan</label>
                  <input
                    value={freePlanName}
                    onChange={(e) => setFreePlanName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-400 rounded-lg px-4 py-2 text-sm"
                  />
                </div>
              </div>

               {/* feature */}
                <div className="md:col-span-3">
                  <label className="block text-sm mb-2">Fonctionnalités</label>

                  {features.map((item, index) => (
                    <div key={index} className="flex gap-3 mb-3">
                      <input
                        type="text"
                        value={item}
                        placeholder={`Feature ${index + 1}`}
                        onChange={(e) =>
                          handleFeatureChange(index, e.target.value)
                        }
                        className="flex-1 bg-gray-50 border border-gray-400 rounded-lg px-4 py-2 text-sm"
                      />

                      {features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureField(index)}
                          className="px-3 text-sm border rounded-lg text-red-600"
                        >
                          Supprimé
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addFeatureField}
                    className="mt-2 text-sm text-emerald-900 font-medium"
                  >
                    + Ajouter une fonctionnalité
                  </button>
                </div>

              <div className="mb-6 mt-4">
                <label className="block text-sm mb-2">Description</label>
                <textarea
                  rows={4}
                  value={freeDescription}
                  onChange={(e) => setFreeDescription(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-400 rounded-lg px-4 py-3 text-sm resize-none"
                />
              </div>

              <hr className="my-6" />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Statut de l’offre</h3>
                  <p className="text-xs text-gray-600">
                    Activez cette option pour masquer ce forfait sur la page des tarifs.
                  </p>
                </div>

                <button
                  onClick={() => setFreeIsActive(!freeIsActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    freeIsActive ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 bg-white rounded-full transform ${
                      freeIsActive ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  disabled={loading}
                  onClick={handleSaveFree}
                  className="px-6 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-full text-sm disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Enregistrer le plan gratuit"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
