/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React from 'react';
import ParamOverrideEditorModalBasicValueSection from './ParamOverrideEditorModalBasicValueSection';
import ParamOverrideEditorModalPruneObjectsSection from './ParamOverrideEditorModalPruneObjectsSection';
import ParamOverrideEditorModalReturnErrorSection from './ParamOverrideEditorModalReturnErrorSection';
import ParamOverrideEditorModalSyncFieldsSection from './ParamOverrideEditorModalSyncFieldsSection';

const ParamOverrideEditorModalValueEditorSection = ({
  selectedOperation,
  meta,
  mode,
  returnErrorDraft,
  pruneObjectsDraft,
  syncFromTarget,
  syncToTarget,
  updateOperation,
  updateReturnErrorDraft,
  updatePruneObjectsDraft,
  addPruneRule,
  updatePruneRule,
  removePruneRule,
  setHeaderValueExampleVisible,
  formatSelectedOperationValueAsJson,
  buildSyncTargetSpec,
}) => {
  return (
    <>
      {meta.value ? (
        mode === 'return_error' && returnErrorDraft ? (
          <ParamOverrideEditorModalReturnErrorSection
            selectedOperationId={selectedOperation.id}
            returnErrorDraft={returnErrorDraft}
            updateReturnErrorDraft={updateReturnErrorDraft}
          />
        ) : mode === 'prune_objects' && pruneObjectsDraft ? (
          <ParamOverrideEditorModalPruneObjectsSection
            selectedOperationId={selectedOperation.id}
            pruneObjectsDraft={pruneObjectsDraft}
            updatePruneObjectsDraft={updatePruneObjectsDraft}
            addPruneRule={addPruneRule}
            updatePruneRule={updatePruneRule}
            removePruneRule={removePruneRule}
          />
        ) : (
          <ParamOverrideEditorModalBasicValueSection
            selectedOperation={selectedOperation}
            meta={meta}
            mode={mode}
            updateOperation={updateOperation}
            setHeaderValueExampleVisible={setHeaderValueExampleVisible}
            formatSelectedOperationValueAsJson={
              formatSelectedOperationValueAsJson
            }
          />
        )
      ) : null}

      {mode === 'sync_fields' ? (
        <ParamOverrideEditorModalSyncFieldsSection
          selectedOperationId={selectedOperation.id}
          syncFromTarget={syncFromTarget}
          syncToTarget={syncToTarget}
          updateOperation={updateOperation}
          buildSyncTargetSpec={buildSyncTargetSpec}
        />
      ) : null}
    </>
  );
};

export default ParamOverrideEditorModalValueEditorSection;
