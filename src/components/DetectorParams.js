import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { getParamCatalog } from "../utils/paramCatalog";
import "../css/DetectorParams.css";
import { fetchDetectorParameters } from "../service/ConfigurationPageService";

/**
 * props: { deviceId, sensorName }
 * ref   : exposes getPayload() → { parameter_id: newValue }
 */
const DetectorParams = forwardRef(({ deviceId, sensorName }, ref) => {
  /* ---------------------------------------------------------------- state */
  const [current, setCurrent] = useState({});   // { parameter_id: value }
  const [draft,   setDraft]   = useState({});   // { parameter_id: value }
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  /* -------------------------------------------------------- expose to parent */
  useImperativeHandle(ref, () => ({
    /** Only parameters the user actually edited */
    getPayload: () => draft,
  }));

  /* ---------------------------------------------------------------- catalog */
  /* useMemo so we don’t recalc on every keystroke */
  const catalog = useMemo(() => getParamCatalog(sensorName), [sensorName]);

  /* ------------------------------------------ fetch whenever props change */
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchDetectorParameters(deviceId, sensorName);

        // convert array → { id: value }
        const map = {};
        res?.data?.data?.forEach(({ parameter_id, value }) => {
          map[parameter_id] = value;
        });

        if (!cancelled) {
          setCurrent(map);
          setDraft({});          // clear any old edits
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError("Could not load current parameters.");
          setLoading(false);
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, [deviceId, sensorName]);

  /* ----------------------------------------------------------- event handlers */
  const handleChange = (id, value) =>
    setDraft((prev) => ({ ...prev, [id]: value }));

  /* -------------------------------------------------------------- rendering */
  if (loading) return <p>Loading parameters…</p>;
  if (error)   return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="param-container">
      <div className="header-row-config">
        <div></div><div>Current</div><div>New</div>
        <div></div><div>Current</div><div>New</div>
      </div>

      {catalog.map(({ id, label }) => (
        <React.Fragment key={id}>
          <div className="label">{label}</div>

          {/* CURRENT value (read-only) */}
          <input
            type="text"
            disabled
            value={current[id] ?? ""}
            style={{ border: "2px solid black" }}
          />

          {/* NEW value (editable) */}
          <input
            type="text"
            defaultValue={current[id] ?? ""}
            style={{ border: "2px solid black" }}
            onChange={(e) => handleChange(id, e.target.value)}
          />
        </React.Fragment>
      ))}
    </div>
  );
});

export default DetectorParams;
