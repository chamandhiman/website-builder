import React, { useState } from "react";
import { useBuilder } from "@/lib/builder/store";
import type { WidgetData } from "../widgetRegistry";
import {
  type StoreLocatorWidgetData,
  defaultStoreLocatorWidgetData,
  isStoreLocatorWidgetData,
  type StoreLocationItem,
} from "./StoreLocatorTypes";
import { PropertyPanel } from "@/components/builder/property-panel/PropertyPanel";
import {
  Navigation,
  MapPin,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { nanoid } from "nanoid";

interface StoreLocatorPropertiesProps {
  value?: WidgetData;
  onChange?: (nextValue: WidgetData) => void;
  widgetId?: string;
  onClose?: () => void;
}

export function StoreLocatorProperties({
  value = defaultStoreLocatorWidgetData,
  onChange,
  widgetId,
  onClose,
}: StoreLocatorPropertiesProps) {
  const updateWidgetInstance = useBuilder((s) => s.updateWidgetInstance);

  const resolvedWidget: StoreLocatorWidgetData =
    value && isStoreLocatorWidgetData(value)
      ? value
      : defaultStoreLocatorWidgetData;

  const content = resolvedWidget.content;
  const [openStoreId, setOpenStoreId] = useState<string | null>(content.stores[0]?.id || null);

  const updateContent = (patch: Partial<typeof content>) => {
    const updated: StoreLocatorWidgetData = {
      ...resolvedWidget,
      content: {
        ...content,
        ...patch,
      },
    };
    if (onChange) {
      onChange(updated);
    } else if (widgetId) {
      updateWidgetInstance(widgetId, updated as any);
    }
  };

  const handleAddStore = () => {
    const newStore: StoreLocationItem = {
      id: `loc-${nanoid(6)}`,
      name: "New Store Location",
      address: "100 Main St, City, State",
      phone: "(555) 000-0000",
      hours: "Mon - Sat: 9:00 AM - 6:00 PM",
    };
    updateContent({ stores: [...content.stores, newStore] });
    setOpenStoreId(newStore.id);
  };

  const handleUpdateStore = (id: string, patch: Partial<StoreLocationItem>) => {
    const nextStores = content.stores.map((s) => (s.id === id ? { ...s, ...patch } : s));
    updateContent({ stores: nextStores });
  };

  const handleDeleteStore = (id: string) => {
    const nextStores = content.stores.filter((s) => s.id !== id);
    updateContent({ stores: nextStores });
    if (openStoreId === id) setOpenStoreId(nextStores[0]?.id || null);
  };

  return (
    <PropertyPanel title="Store Locator" icon={<Navigation className="h-4 w-4 text-[#059669]" />} onClose={onClose}>
      <div className="space-y-4 p-3.5 text-xs text-zinc-300">
        {/* Section Headers */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide block">
            Section Titles
          </label>
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Heading</label>
            <input
              type="text"
              value={content.heading}
              onChange={(e) => updateContent({ heading: e.target.value })}
              className="w-full bg-[#18181B] border border-[#27272A] focus:border-[#FACC15] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Subheading</label>
            <input
              type="text"
              value={content.subheading}
              onChange={(e) => updateContent({ subheading: e.target.value })}
              className="w-full bg-[#18181B] border border-[#27272A] focus:border-[#FACC15] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
            />
          </div>
        </div>

        {/* Primary Map Location */}
        <div className="space-y-1.5 pt-3 border-t border-[#26262B]">
          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide block">
            Map Center Address
          </label>
          <input
            type="text"
            value={content.mapAddress}
            onChange={(e) => updateContent({ mapAddress: e.target.value })}
            placeholder="e.g. New York, NY or full address"
            className="w-full bg-[#18181B] border border-[#27272A] focus:border-[#FACC15] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
          />
          <p className="text-[10.5px] text-zinc-500">
            Center point for the embedded Google Map.
          </p>
        </div>

        {/* Layout & Sizing */}
        <div className="space-y-3 pt-3 border-t border-[#26262B]">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
              Layout Style
            </label>
            <div className="flex items-center bg-[#1A1A1E] p-0.5 rounded-lg border border-zinc-800 text-[10px]">
              <button
                type="button"
                onClick={() => updateContent({ layout: "split" })}
                className={`px-2 py-1 rounded font-medium ${
                  content.layout === "split" ? "bg-[#FACC15] text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                Split Side-by-Side
              </button>
              <button
                type="button"
                onClick={() => updateContent({ layout: "stacked" })}
                className={`px-2 py-1 rounded font-medium ${
                  content.layout === "stacked" ? "bg-[#FACC15] text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                Stacked
              </button>
            </div>
          </div>

          {/* Width */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-zinc-400">Section Width</span>
            <div className="flex items-center bg-[#1A1A1E] p-0.5 rounded-lg border border-zinc-800 text-[10px]">
              <button
                type="button"
                onClick={() => updateContent({ widthMode: "custom" })}
                className={`px-2 py-0.5 rounded font-medium ${
                  content.widthMode === "custom" ? "bg-[#FACC15] text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                Custom
              </button>
              <button
                type="button"
                onClick={() => updateContent({ widthMode: "full" })}
                className={`px-2 py-0.5 rounded font-medium ${
                  content.widthMode === "full" ? "bg-[#FACC15] text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                Full
              </button>
            </div>
          </div>

          {content.widthMode === "custom" && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Max Width</span>
                <span className="font-mono text-white">{content.maxWidth}</span>
              </div>
              <input
                type="range"
                min="600"
                max="1440"
                step="40"
                value={parseInt(content.maxWidth, 10) || 1200}
                onChange={(e) => updateContent({ maxWidth: `${e.target.value}px` })}
                className="w-full accent-[#FACC15] cursor-pointer"
              />
            </div>
          )}

          {/* Map Height */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Map Height</span>
              <span className="font-mono text-white">{content.mapHeight}</span>
            </div>
            <input
              type="range"
              min="280"
              max="700"
              step="20"
              value={parseInt(content.mapHeight, 10) || 440}
              onChange={(e) => updateContent({ mapHeight: `${e.target.value}px` })}
              className="w-full accent-[#FACC15] cursor-pointer"
            />
          </div>
        </div>

        {/* Store Locations List Manager */}
        <div className="space-y-2.5 pt-3 border-t border-[#26262B]">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
              Store Locations ({content.stores.length})
            </label>
            <button
              type="button"
              onClick={handleAddStore}
              className="px-2 py-1 rounded bg-[#059669] hover:bg-[#047857] text-white text-[10px] font-bold flex items-center gap-1 transition-colors"
            >
              <Plus size={12} />
              <span>Add Location</span>
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
            {content.stores.map((store, index) => {
              const isOpen = openStoreId === store.id;
              return (
                <div key={store.id} className="rounded-lg border border-[#27272A] bg-[#18181B] overflow-hidden">
                  <div
                    className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-zinc-800/50"
                    onClick={() => setOpenStoreId(isOpen ? null : store.id)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin size={13} className="text-[#059669] shrink-0" />
                      <span className="truncate text-xs font-semibold text-white">
                        {index + 1}. {store.name || "Untitled"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {content.stores.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStore(store.id);
                          }}
                          className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Delete Location"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                      {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="p-2.5 pt-0 border-t border-zinc-800/70 space-y-2 bg-[#141416]">
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-0.5">Location Name</label>
                        <input
                          type="text"
                          value={store.name}
                          onChange={(e) => handleUpdateStore(store.id, { name: e.target.value })}
                          className="w-full bg-[#1F1F24] border border-zinc-700/80 rounded px-2 py-1 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-0.5">Full Address</label>
                        <input
                          type="text"
                          value={store.address}
                          onChange={(e) => handleUpdateStore(store.id, { address: e.target.value })}
                          className="w-full bg-[#1F1F24] border border-zinc-700/80 rounded px-2 py-1 text-xs text-white outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-0.5">Phone Number</label>
                          <input
                            type="text"
                            value={store.phone}
                            onChange={(e) => handleUpdateStore(store.id, { phone: e.target.value })}
                            className="w-full bg-[#1F1F24] border border-zinc-700/80 rounded px-2 py-1 text-xs text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-0.5">Operating Hours</label>
                          <input
                            type="text"
                            value={store.hours}
                            onChange={(e) => handleUpdateStore(store.id, { hours: e.target.value })}
                            className="w-full bg-[#1F1F24] border border-zinc-700/80 rounded px-2 py-1 text-xs text-white outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Padding */}
        <div className="space-y-2 pt-3 border-t border-[#26262B]">
          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide block">
            Section Spacing
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                <span>Top Spacing</span>
                <span>{content.paddingTop}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="96"
                step="4"
                value={content.paddingTop}
                onChange={(e) => updateContent({ paddingTop: parseInt(e.target.value, 10) || 0 })}
                className="w-full accent-[#FACC15]"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                <span>Bottom Spacing</span>
                <span>{content.paddingBottom}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="96"
                step="4"
                value={content.paddingBottom}
                onChange={(e) => updateContent({ paddingBottom: parseInt(e.target.value, 10) || 0 })}
                className="w-full accent-[#FACC15]"
              />
            </div>
          </div>
        </div>
      </div>
    </PropertyPanel>
  );
}
