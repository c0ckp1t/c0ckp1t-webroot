

export function buildNode(key, label, path = null, metadata = null, isDir = true, expanded = false) {
    return {
        key: key,
        path: path,
        label: label,
        children: [],
        expanded: expanded,
        isDirectory: isDir,
        metadata: metadata,
        parent: null
    }
}

/*
  Given output of linux file command will return the symbolic link it points to.
  input:
    /opt/c0ckp1t/projects/terraform/sorsha-public-0: symbolic link to /home/ellis/github/c0ckp1t-content-private/wf-sorsha-deploy/data/terraform/sorsha-public-0
  output:
    /home/ellis/github/c0ckp1t-content-private/wf-sorsha-deploy/data/terraform/sorsha-public-0
 */
export function extractSymbolicLinkTarget(inputString) {
  const linkIndicator = "symbolic link to ";
  const startIndex = inputString.indexOf(linkIndicator);
  if (startIndex === -1) {
    throw "[extractSymbolicLinkTarget] - link indicator not found"
  }
  return inputString.substring(startIndex + linkIndicator.length).trim();
}

export function pathToKeyArr(path) {
    if(path === "" || path === null) return [""]
    if(path === "/") return [""]
    if(path.trim().endsWith('/')) throw Error("Path must not have a trailing slash ")
    const dirs = path.split("/")
    return dirs
}

export function lastKey(path) {
    const arr = pathToKeyArr(path)
    if(arr.length === 0) return ""
    return arr.pop()
}

export function cleanAbsPath(absPath) {
    if (absPath === '/') return '/'
    if (absPath === null) throw Error("absPath cannot be null")
    let absPathCleaned = absPath.trim()
    if (absPathCleaned.at(-1) === '/') return absPathCleaned.slice(0, absPathCleaned.length - 1)
    return absPathCleaned
}


export function Tree(rootKey, rootPath, rootLabel) {
    this.root = [{
        key: rootKey,
        label: rootLabel,
        path: rootPath,
        parent: null,
        metadata: null,
        children: [],
        expanded: true,
        isDirectory: true
    }]



    this.insertByParent = function (parentNode, insertNode) {
        if(!parentNode.hasOwnProperty('children')) throw Error("parentNode doesn't have children property")
        if(!Array.isArray(parentNode.children)) throw Error("children property is not an array")
        const index = parentNode.children.findIndex(node => node.key === insertNode.key)
        if(index === -1) {
            // not found so insert into back of array then sort
            parentNode.children.push(insertNode)
            parentNode.children = parentNode.children.slice().sort((a, b) => a.key.localeCompare(b.key))
        } else {
            // overwrite
            parentNode.children[index] = insertNode
        }

        if(parentNode.path === '/') {
            insertNode.path = `/${insertNode.key}`
        } else {
            insertNode.path = `${parentNode.path}/${insertNode.key}`
        }
        insertNode.parent = parentNode
        return insertNode
    }





    this.findOrCreateParent = function(keyArr) {
        if(!Array.isArray(keyArr))  throw Error("findOrCreateParent - keyArr parameter is not an array")
        if(keyArr.length === 0) return this.root[0]
        let currentNode = this.root[0]
        if(currentNode.key !== keyArr[0])  throw Error(`findOrCreateParent - keyArr is not valid ${keyArr[0]}!=${currentNode.key}`)
        // we expect the keyArr[0] to be the key of the root[0]
        keyArr.shift()
        for (let key of keyArr) {
            const index = currentNode.children.findIndex(node => node.key === key)
            if(index === -1) {
                const newNode = buildNode(key, `${currentNode.path}/${key}`, key)
                this.insertByParent(currentNode, newNode)
                currentNode = newNode
            } else {
                currentNode = currentNode.children[index]
            }
        }
        return currentNode
    }

    this.insertByKeyArr = function (insertArr, insertNode) {
        if(!Array.isArray(insertArr))  throw Error("insertArr parameter is not an array")
        const parent = this.findOrCreateParent(insertArr)
        return this.insertByParent(parent, insertNode)
    }

    this.findNode = function(keyArr) {
        let currentNode = this.root[0]
        if(currentNode.key !== keyArr[0])  throw Error(`keyArr is not valid ${keyArr[0]}!=${currentNode.key}`)
        // we expect the keyArr[0] to be the key of the root[0]
        keyArr.shift()
        for (let key of keyArr) {
            const index = currentNode.children.findIndex(node => node.key === key)
            if(index !== -1) {
                currentNode = currentNode.children[index]
            } else {
                throw Error(`Parent not found using keyArr=${keyArr}`)
            }
        }
        return currentNode
    }

    this.deleteByKeyArr = function (deleteArr) {
        if(!Array.isArray(deleteArr))  throw Error("deleteArr parameter is not an array")
        const parent = this.findNode(deleteArr).parent
        const key = deleteArr[deleteArr.length - 1]
        const index = parent.children.findIndex(node => node.key === key)
        // console.log(`[deleteArr] - index=${index} - parent=${parent.label}`)
        // returns the deleted item
        return parent.children.splice(index, 1)[0]
    }

    this.deleteNode = function (node) {
        if(node == this.root[0])  throw Error("cannot delete root")
        const parent = node.parent
        const index = parent.children.findIndex(child => child.key === node.key)
        // console.log(`[deleteArr] - index=${index} - parent=${parent.label}`)
        // returns the deleted item
        return parent.children.splice(index, 1)[0]
    }

    this.nodeToString = function(node, indent = 0) {
        let output = ' '.repeat(indent) + `${node.key} - ${node.path}\n`
        return output + this.childrenToString(node.children, indent + 1)
    }

    this.childrenToString = function(children, indent = 0) {
        // console.log(children)
        if(!Array.isArray(children)) throw Error("children property is not an array")
        let output = ""
        for (let node of children) {
            output += this.nodeToString(node, indent)
        }
        return output
    }

    this.toString = function() {
        return this.childrenToString(this.root)
    }
}

