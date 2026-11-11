export const repositoryNameHint='仅支持英文字母、数字、连字符（-）、下划线（_）和英文句点（.），不支持中文或空格，最多 100 个字符。';
export function repositoryNameError(value){
 if(typeof value!=='string'||!value)return '请填写仓库名称。';
 if(value.length>100)return '仓库名称不能超过 100 个字符。';
 if(!/^[A-Za-z0-9_.-]+$/.test(value))return '仓库名称不能包含中文、空格或其他特殊字符，请使用英文字母、数字、-、_ 或英文句点。';
 if(value==='.'||value==='..')return '仓库名称不能仅为一个或两个英文句点。';
 return '';
}
