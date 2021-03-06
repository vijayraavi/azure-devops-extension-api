﻿/*
 * ---------------------------------------------------------
 * Copyright(C) Microsoft Corporation. All rights reserved.
 * ---------------------------------------------------------
 */

import { IVssRestClientOptions } from "../Common/Context";
import { RestClientBase } from "../Common/RestClientBase";

import Graph = require("../Graph/Graph");
import WebApi = require("../WebApi/WebApi");

export class GraphRestClient extends RestClientBase {
    constructor(options: IVssRestClientOptions) {
        super(options);
    }

    public static readonly RESOURCE_AREA_ID = "bb1e7ec9-e901-4b68-999a-de7012b920f8";

    /**
     */
    public async getCachePolicies(
        ): Promise<Graph.GraphCachePolicies> {

        return this.beginRequest<Graph.GraphCachePolicies>({
            apiVersion: "5.1-preview.1",
            routeTemplate: "_apis/Graph/CachePolicies"
        });
    }

    /**
     * Resolve a storage key to a descriptor
     * 
     * @param storageKey - Storage key of the subject (user, group, scope, etc.) to resolve
     */
    public async getDescriptor(
        storageKey: string
        ): Promise<Graph.GraphDescriptorResult> {

        return this.beginRequest<Graph.GraphDescriptorResult>({
            apiVersion: "5.1-preview.1",
            routeTemplate: "_apis/Graph/Descriptors/{storageKey}",
            routeValues: {
                storageKey: storageKey
            }
        });
    }

    /**
     * Acquires the full set of federated provider authentication data available for the given graph subject and provider name.
     * 
     * @param subjectDescriptor - the descriptor of the graph subject that we should acquire data for
     * @param providerName - the name of the provider to acquire data for, e.g. "github.com"
     * @param versionHint - a version hint that can be used for optimistic cache concurrency and to support retries on access token failures; note that this is a hint only and does not guarantee a particular version on the response
     */
    public async getFederatedProviderData(
        subjectDescriptor: string,
        providerName: string,
        versionHint?: number
        ): Promise<Graph.GraphFederatedProviderData> {

        const queryValues: any = {
            providerName: providerName,
            versionHint: versionHint
        };

        return this.beginRequest<Graph.GraphFederatedProviderData>({
            apiVersion: "5.1-preview.1",
            routeTemplate: "_apis/Graph/FederatedProviderData/{subjectDescriptor}",
            routeValues: {
                subjectDescriptor: subjectDescriptor
            },
            queryParams: queryValues
        });
    }

    /**
     * Create a new VSTS group or materialize an existing AAD group.
     * 
     * @param creationContext - The subset of the full graph group used to uniquely find the graph subject in an external provider.
     * @param scopeDescriptor - A descriptor referencing the scope (collection, project) in which the group should be created. If omitted, will be created in the scope of the enclosing account or organization. Valid only for VSTS groups.
     * @param groupDescriptors - A comma separated list of descriptors referencing groups you want the graph group to join
     */
    public async createGroup(
        creationContext: Graph.GraphGroupCreationContext,
        scopeDescriptor?: string,
        groupDescriptors?: string[]
        ): Promise<Graph.GraphGroup> {

        const queryValues: any = {
            scopeDescriptor: scopeDescriptor,
            groupDescriptors: groupDescriptors && groupDescriptors.join(",")
        };

        return this.beginRequest<Graph.GraphGroup>({
            apiVersion: "5.1-preview.1",
            method: "POST",
            routeTemplate: "_apis/Graph/Groups/{groupDescriptor}",
            queryParams: queryValues,
            body: creationContext
        });
    }

    /**
     * Removes a VSTS group from all of its parent groups.
     * 
     * @param groupDescriptor - The descriptor of the group to delete.
     */
    public async deleteGroup(
        groupDescriptor: string
        ): Promise<void> {

        return this.beginRequest<void>({
            apiVersion: "5.1-preview.1",
            method: "DELETE",
            routeTemplate: "_apis/Graph/Groups/{groupDescriptor}",
            routeValues: {
                groupDescriptor: groupDescriptor
            }
        });
    }

    /**
     * Get a group by its descriptor.
     * 
     * @param groupDescriptor - The descriptor of the desired graph group.
     */
    public async getGroup(
        groupDescriptor: string
        ): Promise<Graph.GraphGroup> {

        return this.beginRequest<Graph.GraphGroup>({
            apiVersion: "5.1-preview.1",
            routeTemplate: "_apis/Graph/Groups/{groupDescriptor}",
            routeValues: {
                groupDescriptor: groupDescriptor
            }
        });
    }

    /**
     * Update the properties of a VSTS group.
     * 
     * @param groupDescriptor - The descriptor of the group to modify.
     * @param patchDocument - The JSON+Patch document containing the fields to alter.
     */
    public async updateGroup(
        groupDescriptor: string,
        patchDocument: WebApi.JsonPatchDocument
        ): Promise<Graph.GraphGroup> {

        return this.beginRequest<Graph.GraphGroup>({
            apiVersion: "5.1-preview.1",
            method: "PATCH",
            routeTemplate: "_apis/Graph/Groups/{groupDescriptor}",
            routeValues: {
                groupDescriptor: groupDescriptor
            },
            customHeaders: {
                "Content-Type": "application/json-patch+json",
            },
            body: patchDocument
        });
    }

    /**
     * @param memberLookup - 
     */
    public async lookupMembers(
        memberLookup: Graph.GraphSubjectLookup
        ): Promise<{ [key: string] : Graph.GraphMember; }> {

        return this.beginRequest<{ [key: string] : Graph.GraphMember; }>({
            apiVersion: "5.1-preview.1",
            method: "POST",
            routeTemplate: "_apis/Graph/MemberLookup",
            body: memberLookup
        });
    }

    /**
     * This endpoint returns a result for any member that has ever been valid in the system, even if the member has since been deleted or has had all their memberships deleted. The current validity of the member is indicated through its disabled property, which is omitted when false.
     * 
     * @param memberDescriptor - The descriptor of the desired member.
     */
    public async getMemberByDescriptor(
        memberDescriptor: string
        ): Promise<Graph.GraphMember> {

        return this.beginRequest<Graph.GraphMember>({
            apiVersion: "5.1-preview.1",
            routeTemplate: "_apis/Graph/Members/{memberDescriptor}",
            routeValues: {
                memberDescriptor: memberDescriptor
            }
        });
    }

    /**
     * Create a new membership between a container and subject.
     * 
     * @param subjectDescriptor - A descriptor to a group or user that can be the child subject in the relationship.
     * @param containerDescriptor - A descriptor to a group that can be the container in the relationship.
     */
    public async addMembership(
        subjectDescriptor: string,
        containerDescriptor: string
        ): Promise<Graph.GraphMembership> {

        return this.beginRequest<Graph.GraphMembership>({
            apiVersion: "5.1-preview.1",
            method: "PUT",
            routeTemplate: "_apis/Graph/Memberships/{subjectDescriptor}/{containerDescriptor}",
            routeValues: {
                subjectDescriptor: subjectDescriptor,
                containerDescriptor: containerDescriptor
            }
        });
    }

    /**
     * Check to see if a membership relationship between a container and subject exists.
     * 
     * @param subjectDescriptor - The group or user that is a child subject of the relationship.
     * @param containerDescriptor - The group that is the container in the relationship.
     */
    public async checkMembershipExistence(
        subjectDescriptor: string,
        containerDescriptor: string
        ): Promise<boolean> {

        return this.beginRequest<Response>({
            apiVersion: "5.1-preview.1",
            method: "HEAD",
            routeTemplate: "_apis/Graph/Memberships/{subjectDescriptor}/{containerDescriptor}",
            routeValues: {
                subjectDescriptor: subjectDescriptor,
                containerDescriptor: containerDescriptor
            }
        }).then(async response => {
            return true;
        }).catch((error) => {
            if (error.status === 404) {
                return false;
            }
            throw error;
        });
    }

    /**
     * Get a membership relationship between a container and subject.
     * 
     * @param subjectDescriptor - A descriptor to the child subject in the relationship.
     * @param containerDescriptor - A descriptor to the container in the relationship.
     */
    public async getMembership(
        subjectDescriptor: string,
        containerDescriptor: string
        ): Promise<Graph.GraphMembership> {

        return this.beginRequest<Graph.GraphMembership>({
            apiVersion: "5.1-preview.1",
            routeTemplate: "_apis/Graph/Memberships/{subjectDescriptor}/{containerDescriptor}",
            routeValues: {
                subjectDescriptor: subjectDescriptor,
                containerDescriptor: containerDescriptor
            }
        });
    }

    /**
     * Deletes a membership between a container and subject.
     * 
     * @param subjectDescriptor - A descriptor to a group or user that is the child subject in the relationship.
     * @param containerDescriptor - A descriptor to a group that is the container in the relationship.
     */
    public async removeMembership(
        subjectDescriptor: string,
        containerDescriptor: string
        ): Promise<void> {

        return this.beginRequest<void>({
            apiVersion: "5.1-preview.1",
            method: "DELETE",
            routeTemplate: "_apis/Graph/Memberships/{subjectDescriptor}/{containerDescriptor}",
            routeValues: {
                subjectDescriptor: subjectDescriptor,
                containerDescriptor: containerDescriptor
            }
        });
    }

    /**
     * Get all the memberships where this descriptor is a member in the relationship.
     * 
     * @param subjectDescriptor - Fetch all direct memberships of this descriptor.
     * @param direction - Defaults to Up.
     * @param depth - The maximum number of edges to traverse up or down the membership tree. Currently the only supported value is '1'.
     */
    public async listMemberships(
        subjectDescriptor: string,
        direction?: Graph.GraphTraversalDirection,
        depth?: number
        ): Promise<Graph.GraphMembership[]> {

        const queryValues: any = {
            direction: direction,
            depth: depth
        };

        return this.beginRequest<Graph.GraphMembership[]>({
            apiVersion: "5.1-preview.1",
            routeTemplate: "_apis/Graph/Memberships/{subjectDescriptor}",
            routeValues: {
                subjectDescriptor: subjectDescriptor
            },
            queryParams: queryValues
        });
    }

    /**
     * Check whether a subject is active or inactive.
     * 
     * @param subjectDescriptor - Descriptor of the subject (user, group, scope, etc.) to check state of
     */
    public async getMembershipState(
        subjectDescriptor: string
        ): Promise<Graph.GraphMembershipState> {

        return this.beginRequest<Graph.GraphMembershipState>({
            apiVersion: "5.1-preview.1",
            routeTemplate: "_apis/Graph/MembershipStates/{subjectDescriptor}",
            routeValues: {
                subjectDescriptor: subjectDescriptor
            }
        });
    }

    /**
     * Traverse memberships of the given subject descriptors.
     * 
     * @param membershipTraversalLookup - Fetch the descendants/ancestors of the list of descriptors depending on direction.
     * @param direction - The default value is Unknown.
     * @param depth - The default value is '1'.
     */
    public async lookupMembershipTraversals(
        membershipTraversalLookup: Graph.GraphSubjectLookup,
        direction?: Graph.GraphTraversalDirection,
        depth?: number
        ): Promise<{ [key: string] : Graph.GraphMembershipTraversal; }> {

        const queryValues: any = {
            direction: direction,
            depth: depth
        };

        return this.beginRequest<{ [key: string] : Graph.GraphMembershipTraversal; }>({
            apiVersion: "5.1-preview.1",
            method: "POST",
            routeTemplate: "_apis/Graph/MembershipTraversals/{subjectDescriptor}",
            queryParams: queryValues,
            body: membershipTraversalLookup
        });
    }

    /**
     * Traverse memberships of the given subject descriptor.
     * 
     * @param subjectDescriptor - Fetch the descendants/ancestors of this descriptor depending on direction.
     * @param direction - The default value is Unknown.
     * @param depth - The default value is '1'.
     */
    public async traverseMemberships(
        subjectDescriptor: string,
        direction?: Graph.GraphTraversalDirection,
        depth?: number
        ): Promise<Graph.GraphMembershipTraversal> {

        const queryValues: any = {
            direction: direction,
            depth: depth
        };

        return this.beginRequest<Graph.GraphMembershipTraversal>({
            apiVersion: "5.1-preview.1",
            routeTemplate: "_apis/Graph/MembershipTraversals/{subjectDescriptor}",
            routeValues: {
                subjectDescriptor: subjectDescriptor
            },
            queryParams: queryValues
        });
    }

    /**
     * @param userDescriptor - 
     */
    public async getProviderInfo(
        userDescriptor: string
        ): Promise<Graph.GraphProviderInfo> {

        return this.beginRequest<Graph.GraphProviderInfo>({
            apiVersion: "5.1-preview.1",
            routeTemplate: "_apis/Graph/Users/{userDescriptor}/ProviderInfo",
            routeValues: {
                userDescriptor: userDescriptor
            }
        });
    }

    /**
     * @param creationContext - 
     * @param scopeDescriptor - 
     */
    public async createScope(
        creationContext: Graph.GraphScopeCreationContext,
        scopeDescriptor?: string
        ): Promise<Graph.GraphScope> {

        return this.beginRequest<Graph.GraphScope>({
            apiVersion: "5.1-preview.1",
            method: "POST",
            routeTemplate: "_apis/Graph/Scopes/{scopeDescriptor}",
            routeValues: {
                scopeDescriptor: scopeDescriptor
            },
            body: creationContext
        });
    }

    /**
     * @param scopeDescriptor - 
     */
    public async deleteScope(
        scopeDescriptor: string
        ): Promise<void> {

        return this.beginRequest<void>({
            apiVersion: "5.1-preview.1",
            method: "DELETE",
            routeTemplate: "_apis/Graph/Scopes/{scopeDescriptor}",
            routeValues: {
                scopeDescriptor: scopeDescriptor
            }
        });
    }

    /**
     * Get a scope identified by its descriptor
     * 
     * @param scopeDescriptor - A descriptor that uniquely identifies a scope.
     */
    public async getScope(
        scopeDescriptor: string
        ): Promise<Graph.GraphScope> {

        return this.beginRequest<Graph.GraphScope>({
            apiVersion: "5.1-preview.1",
            routeTemplate: "_apis/Graph/Scopes/{scopeDescriptor}",
            routeValues: {
                scopeDescriptor: scopeDescriptor
            }
        });
    }

    /**
     * @param scopeDescriptor - 
     * @param patchDocument - 
     */
    public async updateScope(
        scopeDescriptor: string,
        patchDocument: WebApi.JsonPatchDocument
        ): Promise<void> {

        return this.beginRequest<void>({
            apiVersion: "5.1-preview.1",
            method: "PATCH",
            routeTemplate: "_apis/Graph/Scopes/{scopeDescriptor}",
            routeValues: {
                scopeDescriptor: scopeDescriptor
            },
            customHeaders: {
                "Content-Type": "application/json-patch+json",
            },
            body: patchDocument
        });
    }

    /**
     * Resolve a descriptor to a storage key.
     * 
     * @param subjectDescriptor - 
     */
    public async getStorageKey(
        subjectDescriptor: string
        ): Promise<Graph.GraphStorageKeyResult> {

        return this.beginRequest<Graph.GraphStorageKeyResult>({
            apiVersion: "5.1-preview.1",
            routeTemplate: "_apis/Graph/StorageKeys/{subjectDescriptor}",
            routeValues: {
                subjectDescriptor: subjectDescriptor
            }
        });
    }

    /**
     * Resolve descriptors to users, groups or scopes (Subjects) in a batch.
     * 
     * @param subjectLookup - A list of descriptors that specifies a subset of subjects to retrieve. Each descriptor uniquely identifies the subject across all instance scopes, but only at a single point in time.
     */
    public async lookupSubjects(
        subjectLookup: Graph.GraphSubjectLookup
        ): Promise<{ [key: string] : Graph.GraphSubject; }> {

        return this.beginRequest<{ [key: string] : Graph.GraphSubject; }>({
            apiVersion: "5.1-preview.1",
            method: "POST",
            routeTemplate: "_apis/Graph/SubjectLookup",
            body: subjectLookup
        });
    }

    /**
     * @param subjectDescriptor - 
     */
    public async getSubject(
        subjectDescriptor: string
        ): Promise<Graph.GraphSubject> {

        return this.beginRequest<Graph.GraphSubject>({
            apiVersion: "5.1-preview.1",
            routeTemplate: "_apis/Graph/Subjects/{subjectDescriptor}",
            routeValues: {
                subjectDescriptor: subjectDescriptor
            }
        });
    }

    /**
     * Materialize an existing AAD or MSA user into the VSTS account.
     * 
     * @param creationContext - The subset of the full graph user used to uniquely find the graph subject in an external provider.
     * @param groupDescriptors - A comma separated list of descriptors of groups you want the graph user to join
     */
    public async createUser(
        creationContext: Graph.GraphUserCreationContext,
        groupDescriptors?: string[]
        ): Promise<Graph.GraphUser> {

        const queryValues: any = {
            groupDescriptors: groupDescriptors && groupDescriptors.join(",")
        };

        return this.beginRequest<Graph.GraphUser>({
            apiVersion: "5.1-preview.1",
            method: "POST",
            routeTemplate: "_apis/Graph/Users/{userDescriptor}",
            queryParams: queryValues,
            body: creationContext
        });
    }

    /**
     * Disables a user.
     * 
     * @param userDescriptor - The descriptor of the user to delete.
     */
    public async deleteUser(
        userDescriptor: string
        ): Promise<void> {

        return this.beginRequest<void>({
            apiVersion: "5.1-preview.1",
            method: "DELETE",
            routeTemplate: "_apis/Graph/Users/{userDescriptor}",
            routeValues: {
                userDescriptor: userDescriptor
            }
        });
    }

    /**
     * Get a user by its descriptor.
     * 
     * @param userDescriptor - The descriptor of the desired user.
     */
    public async getUser(
        userDescriptor: string
        ): Promise<Graph.GraphUser> {

        return this.beginRequest<Graph.GraphUser>({
            apiVersion: "5.1-preview.1",
            routeTemplate: "_apis/Graph/Users/{userDescriptor}",
            routeValues: {
                userDescriptor: userDescriptor
            }
        });
    }

}
